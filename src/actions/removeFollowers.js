"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function unFollower(currUserId, followedUserId) {
  await db.query(
    `DELETE FROM follows
            WHERE follower_id = $1 AND followed_id = $2;`,
    [followedUserId, currUserId]
  );
  revalidatePath("/profile");
  redirect("/profile");
}
