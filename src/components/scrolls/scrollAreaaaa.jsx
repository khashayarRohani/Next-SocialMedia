"use client";
import React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "../scroll.css";
import AvatarDemo from "../Avatar";

import { unFollow } from "@/actions/removeFollowing";
import Link from "next/link";

export function ScrollAreaDemoooo(props) {
  return (
    <ScrollArea.Root className="ScrollAreaRoot">
      <ScrollArea.Viewport className="ScrollAreaViewport">
        <div style={{ padding: "5px 2px" }}>
          <div className="Text">Followers</div>
          <table>
            <thead>
              <tr className="trHead">
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {props.followers.map((follower) => (
                <tr className="trBody" key={follower.id}>
                  <td>
                    <AvatarDemo src={follower.profile_picture_url} />
                    <Link href={`/profile/${follower.id}`}>
                      {follower.first_name}
                    </Link>
                  </td>
                  <td>{follower.email}</td>
                  <td>
                    <Link href={`/profile/${follower.id}`}>Click To see</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="ScrollAreaCorner" />
    </ScrollArea.Root>
  );
}
