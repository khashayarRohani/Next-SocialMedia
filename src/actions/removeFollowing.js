"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function unFollow(currUserId, UnfollowUserId) {
  await db.query(
    `DELETE FROM follows
            WHERE follower_id = $1 AND followed_id = $2;`,
    [currUserId, UnfollowUserId]
  );
  revalidatePath("/profile");
  redirect("/profile");
}
