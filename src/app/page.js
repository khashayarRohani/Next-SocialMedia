"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import UploadImage from "@/components/ImageUploading";

export default function Home() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div>
      <div className="container">
        <motion.img
          src="/Images/off.png"
          className="full-screen-image"
          initial={{ opacity: 1 }}
          animate={{ opacity: showOverlay ? 0 : 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        <motion.img
          src="/Images/on.png"
          className="full-screen-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: showOverlay ? 1 : 0, rotate: "10deg" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          alt="On Image"
          whileHover={{ rotate: "5deg" }}
        />
      </div>

      <div className="overlay">
        <p>Welcome to KHash Web, Click the buttons to register</p>

        <SignedOut>
          <p>Make friends Now</p>
          <SignInButton
            onMouseEnter={() => setShowOverlay(true)}
            onMouseLeave={() => setShowOverlay(false)}
          >
            Register
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
