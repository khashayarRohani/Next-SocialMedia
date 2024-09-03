import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

import "./posts.css";
import { revalidatePath } from "next/cache";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import LikeSVG from "@/components/likeSVG";
import TrashSVG from "@/components/Trash";
import NoProfile from "@/components/NoProfile";
import { currentUser } from "@clerk/nextjs/server";
import DontLikeSVG from "@/components/DontLikeSVG";

export default async function Posts() {
  const res = await db.query(
    `SELECT posts.*, 
       users.first_name,
      
       users.profile_picture_url, 
        
       roles.role_name
FROM posts 
JOIN users ON posts.user_id = users.id 
LEFT JOIN UserRoles ON users.id = UserRoles.user_id
LEFT JOIN Roles ON UserRoles.role_id = Roles.id
ORDER BY posts.id;
`
  );

  const posts = res.rows;
  console.log(posts);

  const CurrUser = await currentUser();
  if (!CurrUser) {
    return (
      <div className="flex flex-col gap-0">
        <p className="text-yellow-600">
          You need to be{" "}
          <SignInButton className="text-red-600">Logged in</SignInButton> to
          view this page.
        </p>
      </div>
    );
  }

  const ress = await db.query(`SELECT * FROM users WHERE clerk_id =$1`, [
    CurrUser?.id,
  ]);
  const user = ress.rows[0];
  if (!user) {
    return <NoProfile />;
  }
  const roleRes = await db.query(
    `SELECT roles.role_name FROM userroles
     RIGHT JOIN roles ON role_id = roles.id
     WHERE user_id =$1`,
    [user?.id]
  );

  if (roleRes.rowCount === 0) {
    throw new Error("Role not found for the current user.");
  }

  const currentUserRole = roleRes.rows[0].role_name;
  console.log(`Current user role checking ${currentUserRole}`);
  async function handleLike(formData) {
    "use server";

    const postId = formData.get("postId");
    const checkLike = await db.query(
      `SELECT * FROM likes WHERE user_id=$1 AND post_id=$2`,
      [user.id, postId]
    );
    if (!checkLike.rows[0]) {
      await db.query(
        "UPDATE posts SET like_count = like_count + 1 WHERE id = $1 RETURNING like_count",
        [postId]
      );
      //here also I have to manage the like table to add who likes what

      await db.query(`INSERT INTO likes  (user_id,post_id) VALUES($1,$2)`, [
        user.id,
        postId,
      ]);

      revalidatePath("/posts");
    } else {
      await db.query(
        "UPDATE posts SET like_count = like_count - 1 WHERE id = $1 RETURNING like_count",
        [postId]
      );

      await db.query(`DELETE FROM likes WHERE user_id = $1 AND post_id = $2`, [
        user.id,
        postId,
      ]);

      revalidatePath("/posts");
    }
  }

  async function handleDelete(formData) {
    "use server";
    const postId = formData.get("postId");
    await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);

    revalidatePath("/posts");
  }

  return (
    <div>
      <div className="postDisplay">
        {posts.map(async (post) => {
          // Check if the current user has liked the post- if i do not do it every conditional acction of this user affects all users
          const likeCheck = await db.query(
            `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
            [user.id, post.id]
          );
          const isLiked = likeCheck.rowCount > 0;
          return (
            <div key={post.id}>
              <div className="bg">
                <h1 className="h1">Posts</h1>
              </div>
              <div className="nft">
                <div className="main">
                  <div className="image-wrapper">
                    <Image
                      className="tokenImage"
                      src={post.content_picture_url}
                      alt="NFT"
                      fill
                      sizes="(min-width: 500px) 100vw, 100vw"
                      style={{ objectFit: "fill" }}
                      priority
                    />
                  </div>

                  <h2>Title: {post.title}</h2>
                  <p className="description">Caption: {post.content}</p>
                  <div className="tokenInfo">
                    <div className="price">
                      <ins>◘</ins>
                      <p>likes: {post.like_count}</p>
                    </div>
                    <div className="duration">
                      <SignedIn>
                        <form action={handleLike}>
                          <input type="hidden" name="postId" value={post.id} />
                          <button className="but" type="submit">
                            {isLiked ? <LikeSVG /> : <DontLikeSVG />}
                          </button>
                        </form>
                        {
                          // prettier-ignore
                          (currentUserRole === 'Manager' || // Manager can access all
                            (currentUserRole === 'Admin' && post.role_name === 'Users') || // Admin can only manage Users
                            (currentUserRole === 'Users' && user.id === post.user_id)) && ( // Users can only manage their own posts
                              <form action={handleDelete}>
                                <input
                                  type="hidden"
                                  name="postId"
                                  value={post.id}
                                />
                                <button className="but">
                                  <TrashSVG />
                                </button>
                              </form>
                            )

                          // prettier-ignore-end
                        }
                      </SignedIn>
                    </div>
                  </div>
                  <hr />
                  <div className="creator">
                    <div className="wrapper">
                      <Image
                        src={post.profile_picture_url}
                        alt="Creator"
                        width={200}
                        height={200}
                        style={{ objectFit: "cover" }}
                        priority
                      />
                    </div>
                    <div className="check">
                      <p>
                        <ins>Post by</ins>{" "}
                        <Link href={`/profile/${post.user_id}`}>
                          {post.first_name}
                        </Link>
                      </p>
                      <div>
                        <Link href={`/posts/${post.id}`}>
                          <button className="but">Details</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
