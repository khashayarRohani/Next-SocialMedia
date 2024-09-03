import { db } from "@/lib/db";
import { SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import "./ProfileForm.css";
import { revalidatePath } from "next/cache";
export default async function ProfileForm() {
  const CurrUser = await currentUser();

  async function handleProfileForm(formData) {
    "use server";
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    const bio = formData.get("bio");
    const email = formData.get("email");

    await db.query(
      `INSERT INTO users(email,bio,first_name,last_name,profile_picture_url,clerk_id) VALUES($1,$2,$3,$4,$5,$6)  `,
      [email, bio, first_name, last_name, CurrUser?.imageUrl, CurrUser?.id]
    );
    const resp = await db.query(`SELECT * FROM users WHERE clerk_id=$1`, [
      CurrUser?.id,
    ]);
    const user = resp.rows[0];
    await db.query(
      `INSERT INTO   userroles (user_id , role_id) values($1,$2)`,
      [user.id, 3]
    );
    debugger;
    revalidatePath("/profile");
    redirect("/profile");
  }

  return (
    <div>
      <form className="profileForm" action={handleProfileForm}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            placeholder={CurrUser?.emailAddresses[0].emailAddress || ""}
            type="email"
            id="email"
          />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <input name="bio" placeholder="bio" type="text" id="bio" />
        </div>
        <div>
          <label htmlFor="profile_picture">Choose a profile:</label>
          <input
            name="profile_picture"
            placeholder="profile_picture"
            type="hidden"
            id="profile_picture"
          />
        </div>
        <div>
          <label htmlFor="first_name">Name:</label>
          <input
            name="first_name"
            type="text"
            id="first_name"
            placeholder={CurrUser?.firstName || "name"}
          />
        </div>
        <div>
          <label htmlFor="last_name">Family:</label>
          <input
            name="last_name"
            type="text"
            id="last_name"
            placeholder={CurrUser?.lastName || "last_Name"}
          />
        </div>
        <button>Submit information</button>
      </form>
    </div>
  );
}
