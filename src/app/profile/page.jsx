import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import NoProfile from "@/components/NoProfile";
import "./profile.css";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import AlertDialogDemo from "@/components/DeleteAccountBtn";

import { fetchFollowings } from "@/actions/fetchFollowings";
import { fetchFollowers } from "@/actions/fetchFollowers";

import PopUpFollowers from "@/components/popUpFollowers";

import PopUpScroll from "@/components/popUpScroll";
import { unFollow } from "@/actions/removeFollowing";
import { unFollower } from "@/actions/removeFollowers";

export default async function ProfilePage() {
  try {
    const CurrUser = await currentUser();

    if (!CurrUser) {
      return (
        <div className="flex flex-col gap-0">
          <p className="text-yellow-600">
            You need to be
            <SignInButton className="text-red-600">Logged in</SignInButton> to
            view this page.
          </p>
        </div>
      );
    }

    const res = await db.query(`SELECT * FROM users WHERE clerk_id = $1`, [
      CurrUser?.id,
    ]);
    const user = res.rows[0];
    if (!user) {
      return <NoProfile />;
    }

    const roleRes = await db.query(
      `SELECT roles.role_name FROM userroles
      RIGHT JOIN roles ON role_id = roles.id
      WHERE user_id = $1`,
      [user.id]
    );

    if (!roleRes.rows[0]) {
      throw new Error("User role not found.");
    }
    const followings = await fetchFollowings(user.id);
    const followers = await fetchFollowers(user.id);

    return (
      <div className="profileBody">
        <article className="profile">
          <div className="profile-image">
            {user?.profile_picture_url ? (
              <Image
                priority
                sizes="(min-width: 500px) 100vw, 100vw"
                src={user.profile_picture_url}
                fill
                alt="Profile"
              />
            ) : (
              <p>No profile image available</p>
            )}
          </div>
          <h2 className="profile-username">
            {user.first_name + " " + user.last_name}
          </h2>
          <small className="profile-user-handle">{user.email}</small>
          <p>Role: {roleRes.rows[0].role_name}</p>
          <div className="profile-actions">
            <Link href="/posts" className="btn btnprimary">
              Posts
            </Link>
            <Link href="/createpost">
              <button className="btn btnprimary">Make Post</button>
            </Link>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                width: "290px",
                borderRadius: "10px",
              }}
            >
              <AlertDialogDemo id={user.id} />
              <PopUpScroll // for following
                unFollow={unFollow}
                userId={user.id}
                followers={followings}
              />
              <PopUpFollowers // for followers
                unFollower={unFollower}
                userId={user.id}
                followings={followers}
              />
            </div>
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
    );
  } catch (error) {
    throw new Error(`Error occurred in ProfilePage: ${error.message}`);
  }
}
