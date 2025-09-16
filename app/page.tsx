"use client";

import Link from "next/link";
import Button from "./components/ui/Button";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold">Spark</h1>
        <p className="text-gray-600">A minimal social app — sign up, edit your profile, and share posts.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/posts"><Button>View Posts</Button></Link>
          <Link href="/signup" className="text-blue-600 underline">Create an account</Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Feature title="Fast Signup" desc="Email/password auth with Firebase. Edit your profile in seconds."/>
        <Feature title="Realtime Feed" desc="Posts stream in instantly using Firestore onSnapshot."/>
        <Feature title="Secure by Default" desc="Rules limit write access to the owner; posts are public-read."/>
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}
