import { db } from "@/lib/db";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import UploadImage from "@/components/ImageUploading";
import { currentUser } from "@clerk/nextjs/server";
import "./postForm.css";
export default async function EditPost(props) {
  const catResponse = await db.query(`SELECT * from categories`);
  const categories = catResponse.rows;

  const postResponse = await db.query(`SELECT * from posts where id=$1`, [
    props.postId,
  ]);
  const post = postResponse.rows[0];

  const curUser = await currentUser();
  const currentRes = await db.query(`SELECT * FROM users WHERE clerk_id=$1`, [
    curUser.id,
  ]);

  const user = currentRes.rows[0];
  async function handleEditPost(formData) {
    "use server";

    const postId = post.id;

    const title = formData.get("title");

    const content = formData.get("content");

    const categoryId = formData.get("category");
    const newImgUrl = formData.get("imageUrl");

    console.log(`cat is ${categoryId}`);
    const query = `
    UPDATE Posts
SET
    user_id = $1,         
    category_id = $2,       
    title = $3,             
    content = $4,            
    content_picture_url = $5    
WHERE id = $6; 
  `;

    const values = [
      post.user_id,
      categoryId,
      title,
      content,
      newImgUrl,
      postId,
    ];
    if (post.user_id == user.id) {
      await db.query(query, values);

      redirect("/posts");
    } else {
      throw new Error("You are not the owner");
    }
  }

  console.log(post);
  return (
    <>
      <form className={"postForm"} action={handleEditPost}>
        <div className="postFormDiv">
          <label className="postFormLabel" htmlFor="title">
            Post Title:
          </label>
          <input
            name="title"
            placeholder={post.title}
            title="Enter title"
            className="postFormInput"
            required
          />
        </div>

        <div className="postFormDiv">
          <label className="postFormLabel" htmlFor="content">
            Content:
          </label>
          <input
            className="postFormInput"
            name="content"
            placeholder={post.content}
            title="Enter content"
            required
          />
        </div>
        <div className="postFormDiv">
          <label className="postFormLabel" htmlFor="category">
            Category:
          </label>
          <select defaultValue="" name="category">
            <option value="" disabled>
              Select a Type
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="postFormDiv">
          <label className="postFormLabel" htmlFor="content_picture_url">
            Content Image:
          </label>
          <UploadImage />
          <input type="hidden" name="imageUrl" id="imageUrl" />
        </div>

        <div className="postFormDiv">
          <button className="postFormButton" style={{ width: "10rem" }}>
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
