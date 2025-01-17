"use server";
import { db } from "@/lib/db";

export async function fetchFollowers(id) {
  const res = await db.query(
    `SELECT users.id, users.email, users.first_name, users.profile_picture_url
FROM follows
JOIN users ON follows.follower_id = users.id
WHERE follows.followed_id = $1;
`,
    [id]
  );

  return res.rows;
}
