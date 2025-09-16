"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Protected from "../../components/Protected";
import { useAuth } from "../../lib/auth";
import { db } from "../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/Card";

export default function NewPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setPosting(true); setErr(null);
    try {
      await addDoc(collection(db, "posts"), {
        authorId: user.uid,
        authorEmail: user.email ?? null,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      router.replace("/posts"); // go back to feed
    } catch (e: any) {
      setErr(e.message || "Failed to post");
    } finally { setPosting(false); }
  }

  return (
    <Protected>
      <main className="mx-auto max-w-2xl">
        <Card>
          <CardHeader title="Compose new post" />
          <CardContent>
            <form onSubmit={createPost} className="space-y-3">
              <Input
                placeholder="Title (optional)"
                onChange={() => {}}
                style={{ display: "none" }} // keep for future, hidden for now
              />
              <textarea
                className="w-full min-h-32 border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
              />
              {err && <p className="text-red-600 text-sm">{err}</p>}
            </form>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
              <Button onClick={(e:any)=>{e.preventDefault(); createPost(e as any);}} disabled={posting || !text.trim()}>
                {posting ? "Posting..." : "Post"}
              </Button>
              <Button onClick={() => router.back()}>Cancel</Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </Protected>
  );
}
