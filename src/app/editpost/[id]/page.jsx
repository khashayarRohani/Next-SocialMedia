import EditPost from "@/components/EditPosts";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function EditPostPage({ params }) {
  console.log(` param check ${params.id}`);
  return (
    <div>
      <SignedIn>
        <EditPost postId={params.id} />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
