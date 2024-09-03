"use client";
import React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "./scroll.css";
import AvatarDemo from "./Avatar";

import { unFollower } from "@/actions/removeFollowers";
import Link from "next/link";
//followers list
export function ScrollAreaDemoFollowers(props) {
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
              {props.followings.map((following) => (
                <tr className="trBody" key={following.id}>
                  <td>
                    <AvatarDemo src={following.profile_picture_url} />
                    {following.first_name}
                  </td>
                  <td>{following.email}</td>
                  <td>
                    <button
                      onClick={() => {
                        props.unFollower(props.userId, following.id);
                      }}
                    >
                      Remove
                    </button>
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
