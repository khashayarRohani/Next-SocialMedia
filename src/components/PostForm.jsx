import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import UploadImage from "@/components/ImageUploading";
import "./postForm.css";
import { currentUser } from "@clerk/nextjs/server";
export default async function PostForm() {
  const catRes = await db.query(`SELECT * FROM categories`);
  const categories = catRes.rows;

  const currUser = await currentUser();
  const resp = await db.query(`SELECT * FROM users WHERE clerk_id=$1`, [
    currUser.id,
  ]);
  const user = resp.rows[0];
  async function handlePostSubmit(formData) {
    "use server";
    const userId = user.id;
    const title = formData.get("title");

    const content = formData.get("content");

    const categoryId = formData.get("category");
    const newImgUrl = formData.get("imageUrl");

    const query = `
    INSERT INTO posts (user_id, category_id, title, content, content_picture_url, like_count)
    VALUES ($1, $2, $3, $4, $5, 0);
  `;

    const values = [userId, categoryId, title, content, newImgUrl];

    await db.query(query, values);

    revalidatePath(`/posts`);
    redirect("/posts");
  }

  return (
    <>
      <form className="postForm" action={handlePostSubmit}>
        <div className="postFormDiv">
          <label className="postFormLabel" htmlFor="title">
            Post Title:
          </label>
          <input
            className="postFormInput"
            name="title"
            placeholder="title"
            title="Enter title"
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
            placeholder="content"
            title="Enter content"
            required
          />
        </div>
        <div className="postFormDiv">
          <label className="postFormLabel" htmlFor="content_picture_url">
            Content Image:
          </label>
          <UploadImage />
          <input
            className="postFormInput"
            type="hidden"
            name="imageUrl"
            id="imageUrl"
          />
        </div>
        <div className="postFormDiv">
          <label className="postFormLabel" htmlFor="category">
            Category:
          </label>
          <select name="category" defaultValue="">
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
        <div>
          <hr />
        </div>

        <button className="postFormButton">Submit information</button>
      </form>
    </>
  );
}
