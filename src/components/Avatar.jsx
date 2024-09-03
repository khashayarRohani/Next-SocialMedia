"use client";
import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import "./avatar.css";

export default function AvatarDemo(props) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <Avatar.Root className="AvatarRoot">
        <Avatar.Image
          className="AvatarImage"
          src={props.src}
          alt="Colm Tuite"
        />
        <Avatar.Fallback className="AvatarFallback" delayMs={600}>
          CT
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
