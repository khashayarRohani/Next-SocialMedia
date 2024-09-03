import PostForm from "@/components/PostForm";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function CreatePostPage() {
  return (
    <div>
      <SignedIn>
        <PostForm />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
