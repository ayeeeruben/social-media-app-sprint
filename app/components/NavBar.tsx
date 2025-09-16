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
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-neutral-800">
      <nav className="mx-auto max-w-3xl flex items-center justify-between p-3">
        <Link href="/" className="font-bold text-lg">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Spark
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/posts" className="hidden sm:inline hover:underline">
            Posts
          </Link>
          {user ? (
            <>
              <Link href="/posts/new">
                <Button>New Post</Button>
              </Link>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              <Button onClick={handleSignOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}