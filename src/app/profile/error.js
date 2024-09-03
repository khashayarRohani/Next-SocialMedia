// pages/error.js (for app directory use error.js)
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage({ error }) {
  const errorMessage = "An unexpected error occurred. " + error.message;

  return (
    <div>
      <h2 style={{ color: "red" }}>Oh no! An error happened</h2>
      <p style={{ color: "red" }}>{errorMessage}</p>
      <Link href="/" style={{ color: "red" }}>
        Return to Home
      </Link>
    </div>
  );
}
