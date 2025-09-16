// app/components/NavBar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../lib/auth";
import Button from "./ui/Button";

export default function NavBar() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <nav className="mx-auto max-w-4xl flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-lg text-blue-600">Spark</Link>

        <div className="flex gap-3 items-center">
          {/* Everyone sees the feed */}
          <Link href="/posts" className="hover:underline">Posts</Link>

          {user ? (
  <>
    <Link href="/posts/new">
      <Button>New Post</Button>
    </Link>
    <Link href="/profile" className="hover:underline">Profile</Link>
    <Button onClick={handleSignOut}>Sign out</Button>
  </>
) : (
            <>
              <Link href="/login" className="hover:underline">Log in</Link>
              <Link href="/signup" className="hover:underline">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
