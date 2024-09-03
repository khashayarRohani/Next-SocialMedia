"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import "./header.css";
export default function Header() {
  return (
    <div className="header">
      <h1>Kash Media</h1>
      <nav>
        <SignedIn style={{ gap: "0.5rem" }}>
          <SignOutButton>Log-Out</SignOutButton>
          <Link href="/profile">Profile</Link>
          <Link href="/users">Users</Link>
          <Link href="/posts">Posts</Link>
        </SignedIn>
        <SignedOut>
          <SignInButton className="but">Register</SignInButton>
        </SignedOut>
      </nav>
    </div>
  );
}
