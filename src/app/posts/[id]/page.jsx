import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

import "../posts.css";
import "./comments.css";
import { revalidatePath } from "next/cache";

import { SignedIn, SignInButton } from "@clerk/nextjs";
import LikeSVG from "@/components/likeSVG";
import TrashSVG from "@/components/Trash";
import NoProfile from "@/components/NoProfile";
import { currentUser } from "@clerk/nextjs/server";
import DontLikeSVG from "@/components/DontLikeSVG";
import { redirect } from "next/navigation";
import EditSVG from "@/components/EditSVG";

export default async function SinglePost({ params, searchParams }) {
  let i = 0;
  const showForm = searchParams.showForm === "true";
  const isLiked = searchParams.isLiked === "true";
  const postId = params.id;

  const data = await db.query(
    `SELECT 
      posts.id,
      posts.title,
      posts.content,
      posts.content_picture_url,
      posts.like_count,
      post_creator.first_name AS post_creator_first_name,
      post_creator.profile_picture_url AS post_creator_profile_picture_url,
      categories.name AS category_name, 
      categories.id AS category_id,
      ARRAY_AGG(CONCAT(commenters.first_name, ': ', comments.content)) AS comments
  FROM 
      posts
  JOIN 
      users AS post_creator ON posts.user_id = post_creator.id
  LEFT JOIN 
      comments ON posts.id = comments.post_id
  LEFT JOIN 
      users AS commenters ON comments.user_id = commenters.id
  LEFT JOIN 
      categories ON posts.category_id = categories.id  
  WHERE 
      posts.id = $1
  GROUP BY 
      posts.id, 
      posts.title, 
      posts.content, 
      posts.content_picture_url, 
      posts.like_count, 
      post_creator.first_name, 
      post_creator.profile_picture_url,
      categories.name  ,categories.id
  `,
    [postId]
  );
  const post = data.rows[0];

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

      revalidatePath(`/posts/${postId}`);
      redirect(`/posts/${postId}?isLiked=true`);
    } else {
      await db.query(
        "UPDATE posts SET like_count = like_count - 1 WHERE id = $1 RETURNING like_count",
        [postId]
      );

      await db.query(`DELETE FROM likes WHERE user_id = $1 AND post_id = $2`, [
        user.id,
        postId,
      ]);

      revalidatePath(`/posts/${postId}`);
      redirect(`/posts/${postId}?isLiked=false`);
    }
  }

  async function handleDelete(formData) {
    "use server";
    const postId = formData.get("postId");
    await db.query(`DELETE FROM posts WHERE id = $1`, [postId]);

    revalidatePath("/posts");
  }
  async function handleShowForm() {
    "use server";
    redirect(`/posts/${params.id}?showForm=true`);
  }
  async function handleSubmit(formData) {
    "use server";
    const content = formData.get("content");
    const userId = formData.get("user_id");
    const postId = formData.get("post_id");

    await db.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)",
      [postId, userId, content]
    );

    // Redirect back to the post page without the forms
    redirect(`/posts/${params.id}`);
  }
  async function handleEdit(formData) {
    "use server";
    const postId = formData.get("postId");
    console.log(`post id checking for sending ${postId}`);
    redirect(`/editpost/${postId}`);
  }
  return (
    <div>
      <div className="postDisplay">
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
                              <div style={{display:"flex"}}>

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

                              <form action={handleEdit}>
                              <input
                                  type="hidden"
                                  name="postId"
                                  value={post.id}
                                />
                                <button className="but"><EditSVG/></button>
                              </form>
                              </div>
                             
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
                    src={post.post_creator_profile_picture_url}
                    alt="Creator"
                    width={200}
                    height={200}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="check">
                  <p>
                    <ins>Post by</ins>
                    <Link href={`/profile/${post.user_id}`}>
                      {post.post_creator_first_name}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="comments">
        <div className="list">
          <h1> Comments</h1>
          <ul>
            {post.comments.map((comment) => {
              return (
                <li key={i++}>
                  <p>{comment}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div>
        <div>
          {
            <form action={handleShowForm}>
              <button className="butto" type="submit">
                Add Comment
              </button>
            </form>
          }

          {showForm && (
            <form className="commentForms" action={handleSubmit}>
              <label htmlFor="content">Leave a Comment</label>
              <textarea
                name="content"
                placeholder="Write your comments here"
                title="Leave comment"
              ></textarea>
              <input type="hidden" name="user_id" value={user.id} />
              <input type="hidden" name="post_id" value={params.id} />
              <button className="butto">Submit comment</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
