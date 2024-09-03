import AvatarDemo from "@/components/Avatar";
import TrashSVG from "@/components/Trash";
import TrashSVG2 from "@/components/Trash2";
import { db } from "@/lib/db";
import { SignedIn, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";

import Link from "next/link";

export default async function UsersPage() {
  try {
    const CurrUser = await currentUser();
    if (!CurrUser) {
      return <SignInButton />;
    }
    const res = await db.query(`SELECT * FROM users`);
    const users = res.rows;
    console.log(users);
    async function handleDeleteUser(formData) {
      "use server";
      const userId = formData.get("userId");
      await db.query(`DELETE FROM users WHERE id=$1`, [userId]);

      revalidatePath("/users");
      redirect("/posts");
    }
    return (
      <SignedIn>
        <div>
          <table>
            <thead>
              <tr className="trHead">
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr className="trBody" key={user.id}>
                    <td>
                      <AvatarDemo src={user.profile_picture_url} />
                      <Link
                        style={{ marginLeft: ".5rem" }}
                        href={`/profile/${user.id}`}
                      >
                        {user.first_name}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/profile/${user.id}`}>{user.email}</Link>
                    </td>
                    <td>
                      <form action={handleDeleteUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button>
                          <TrashSVG2 />
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SignedIn>
    );
  } catch {
    throw new Error(
      "Something is wrone In Users List, Try Again or Register for Free"
    );
  }
}
