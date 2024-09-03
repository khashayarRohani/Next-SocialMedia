import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import "../profile.css";
import Link from "next/link";
import NoProfile from "@/components/NoProfile";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import PopUpScrolllll from "@/components/scrolls/popUpScrolllll";

import { fetchFollowings } from "@/actions/fetchFollowings";
import { fetchFollowers } from "@/actions/fetchFollowers";

import { unFollow } from "@/actions/removeFollowing";
import { unFollower } from "@/actions/removeFollowers";
import PopUpFollowerssss from "@/components/scroll-other/popUpFollowerssss";
import AlertDialogDemo from "@/components/DeleteAccountBtn";
export default async function ProfilePage({ params }) {
  try {
    const userId = params.id;

    // Check if the current user is authenticated
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

    // Fetch the current user's profile from the database
    const res = await db.query(`SELECT * FROM users WHERE clerk_id =$1`, [
      CurrUser?.id,
    ]);
    const user = res.rows[0];

    // If the current user has no profile, show the NoProfile component
    if (!user) {
      return <NoProfile />;
    }

    // Fetch the current user's role
    const roleRes = await db.query(
      `SELECT roles.role_name FROM userroles
       RIGHT JOIN roles ON role_id = roles.id
       WHERE user_id =$1`,
      [user?.id]
    );

    if (roleRes.rowCount === 0) {
      throw new Error("Role not found for the current user.");
    }

    // Fetch the profile of the user being viewed
    const resp = await db.query(`SELECT * FROM users WHERE id =$1`, [userId]);
    const reviewedUser = resp.rows[0]; // User for review

    if (!reviewedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    // Fetch the role of the user being viewed
    const roleReviewResp = await db.query(
      `SELECT roles.role_name FROM userroles
       RIGHT JOIN roles ON role_id = roles.id
       WHERE user_id =$1`,
      [userId]
    );

    if (roleReviewResp.rowCount === 0) {
      throw new Error("Role not found for the reviewed user.");
    }
    const currentUserRole = roleRes.rows[0].role_name;
    const reviewedUserRole = roleReviewResp.rows[0].role_name;
    const canDeleteOrEdit =
      currentUserRole === "Manager" || // Manager can access all
      (currentUserRole === "Admin" && reviewedUserRole === "Users") || // Admin can only manage Users
      (currentUserRole === "Users" && user.id === reviewedUser.id); // Users can only manage themselves
    const checkingResult = await db.query(
      `SELECT EXISTS(SELECT FROM follows WHERE follower_id=$1 AND followed_id=$2) AS isFollowing`,
      [user.id, userId]
    );
    const isFollowed = checkingResult.rows[0].isfollowing;
    console.log(isFollowed);
    async function handleFollow(formData) {
      "use server";

      await db.query(
        `INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)`,
        [user.id, userId]
      );
      revalidatePath(`/profile/${userId}`);
      redirect(`/profile/${userId}`);
    }

    async function handleUnfollow(formData) {
      "use server";

      await db.query(
        `DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2`,
        [user.id, userId]
      );
      revalidatePath(`/profile/${userId}`);
      redirect(`/profile/${userId}`);
    }
    const followings = await fetchFollowings(reviewedUser.id);
    const followers = await fetchFollowers(reviewedUser.id);

    return (
      <div>
        <SignedIn>
          <div className="profileBody">
            <article className="profile">
              <div className="profile-image">
                <Image
                  src={reviewedUser?.profile_picture_url}
                  fill
                  alt="prof"
                />
              </div>
              <h2 className="profile-username">
                {reviewedUser?.first_name + " " + reviewedUser?.last_name}
              </h2>
              <small className="profile-user-handle">
                {reviewedUser?.email}
              </small>
              <p>Role: {roleReviewResp.rows[0].role_name}</p>
              <div className="profile-actions">
                <form action={isFollowed ? handleUnfollow : handleFollow}>
                  <button className="btn btnprimary" type="submit">
                    {isFollowed ? "Unfollow" : "Follow"}
                  </button>
                </form>

                <PopUpScrolllll followers={followers} />
                <PopUpFollowerssss followings={followings} />
                {canDeleteOrEdit && (
                  <>
                    <AlertDialogDemo id={reviewedUser.id} />
                  </>
                )}
              </div>
              <div className="profile-links">
                <a href="#" className="link link--icon">
                  <i className="ph-twitter-logo"></i>
                </a>
                <a href="#" className="link link--icon">
                  <i className="ph-facebook-logo"></i>
                </a>
                <a href="#" className="link link--icon">
                  <i className="ph-instagram-logo"></i>
                </a>
              </div>
            </article>
          </div>
        </SignedIn>
        <SignedOut>
          <p>Make friends Now</p>
          <SignInButton>Sign in to check profile</SignInButton>
        </SignedOut>
      </div>
    );
  } catch (error) {
    throw new Error(`Error occurred in ProfilePage: ${error.message}`);
  }
}
