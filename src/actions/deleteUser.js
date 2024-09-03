"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUser(id) {
  console.log(id);
  await db.query(`DELETE FROM users WHERE id = $1`, [id]);
  revalidatePath("/profile");
  redirect("/");
}
