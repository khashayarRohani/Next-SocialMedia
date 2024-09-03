"use server";
import { db } from "@/lib/db";

export async function fetchFollowings(id) {
  const res = await db.query(
    `SELECT users.id, users.email, users.first_name, users.profile_picture_url
     FROM follows
     JOIN users ON follows.followed_id = users.id
     WHERE follows.follower_id = $1;`,
    [id]
  );

  return res.rows;
}
