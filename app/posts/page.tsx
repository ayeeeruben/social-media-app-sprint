"use client";

import { useEffect, useState } from "react";
import Protected from "../components/Protected";
import { db } from "../lib/firebase";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";

type Post = {
  id: string;
  authorId: string;
  authorEmail?: string | null;
  text: string;
  createdAt?: any;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const rows: Post[] = [];
      snap.forEach((d) => rows.push({ id: d.id, ...(d.data() as any) }));
      setPosts(rows);
    }, (e) => setErr(e.message));
    return () => unsub();
  }, []);

  return (
    <Protected>
      <main className="mx-auto max-w-2xl space-y-3">
        {err && <p className="text-red-600 text-sm">{err}</p>}
        {posts.length === 0 && <p className="text-sm text-gray-600">No posts yet.</p>}
        {posts.map((p) => (
          <article key={p.id} className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">
              {p.authorEmail ?? "Unknown"} • {formatTime(p.createdAt)}
            </div>
            <p className="mt-2 whitespace-pre-wrap">{p.text}</p>
          </article>
        ))}
      </main>
    </Protected>
  );
}

function formatTime(ts: any) {
  try {
    const date = ts?.toDate ? ts.toDate() : new Date();
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
  } catch { return "now"; }
}
