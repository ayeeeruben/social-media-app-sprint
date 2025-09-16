"use client";
import Link from "next/link";
import Button from "./components/ui/Button";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-gray-200 dark:border-neutral-800 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-900/60 p-8 shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Build, share, and iterate with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Spark</span>
        </h1>
        <p className="mt-3 text-gray-600 dark:text-neutral-400">
          A minimal social app with auth, profiles, posts, comments, and likes.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/posts"><Button>Explore posts</Button></Link>
          <Link href="/signup" className="text-blue-600 dark:text-blue-400 underline">Create an account</Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Feature title="Realtime" desc="Live updates with Firestore listeners." />
        <Feature title="Secure" desc="Granular rules for posts, comments, likes." />
        <Feature title="Polished" desc="Dark mode, glassy navbar, soft cards." />
      </section>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm">
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm text-gray-600 dark:text-neutral-400">{desc}</div>
    </div>
  );
}
