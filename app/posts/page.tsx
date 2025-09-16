"use client";

import { useEffect, useState } from "react";
import Protected from "../components/Protected";
import { useAuth } from "../lib/auth";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import Button from "../components/ui/Button";
import LikeButton from "../components/LikeButton";
import CommentThread from "../components/CommentThread";

type Post = {
  id: string;
  authorId: string;
  authorEmail?: string | null;
  text: string;
  createdAt?: any;  // Firestore Timestamp
  updatedAt?: any;  // Firestore Timestamp
};

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: Post[] = [];
        snap.forEach((d) => rows.push({ id: d.id, ...(d.data() as any) }));
        setPosts(rows);
      },
      (e) => setErr(e.message)
    );
    return () => unsub();
  }, []);

  const isOwner = (p: Post) => !!user?.uid && p.authorId === user.uid;

  function startEdit(p: Post) {
    setEditingId(p.id);
    setDraft(p.text);
  }
  function cancelEdit() {
    setEditingId(null);
    setDraft("");
  }

  async function saveEdit(id: string) {
    if (!draft.trim()) return;
    setSavingId(id);
    try {
      await updateDoc(doc(db, "posts", id), {
        text: draft.trim(),
        updatedAt: serverTimestamp(),
      });
      setEditingId(null);
      setDraft("");
    } catch (e: any) {
      alert(e.message || "Failed to save edit");
    } finally {
      setSavingId(null);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (e: any) {
      alert(e.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Protected>
      <main className="space-y-3">
        {err && <p className="text-red-600 text-sm">{err}</p>}
        {posts.length === 0 && (
          <p className="text-sm text-gray-600 dark:text-neutral-400">No posts yet.</p>
        )}

        {posts.map((p) => {
          const editing = editingId === p.id;
          const initial = (p.authorEmail ?? "U").slice(0, 1).toUpperCase();

          return (
            <article
              key={p.id}
              className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold">
                    {initial}
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-medium">
                      {p.authorEmail ?? "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                      {formatTime(p.createdAt)} {p.updatedAt ? "· edited" : ""}
                    </div>
                  </div>
                </div>

                {isOwner(p) && (
                  <div className="flex gap-2">
                    {!editing ? (
                      <>
                        <Button onClick={() => startEdit(p)}>Edit</Button>
                        <Button
                          onClick={() => deletePost(p.id)}
                          disabled={deletingId === p.id}
                        >
                          {deletingId === p.id ? "Deleting…" : "Delete"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => saveEdit(p.id)}
                          disabled={savingId === p.id || !draft.trim()}
                        >
                          {savingId === p.id ? "Saving…" : "Save"}
                        </Button>
                        <Button onClick={cancelEdit}>Cancel</Button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Body */}
              {!editing ? (
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">
                  {p.text}
                </p>
              ) : (
                <textarea
                  className="mt-3 w-full min-h-28 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoFocus
                />
              )}

              {/* Actions */}
              <div className="mt-3 flex items-center gap-4 text-sm">
                <div className="opacity-90">
                  <LikeButton postId={p.id} />
                </div>
              </div>

              {/* Comments */}
              <div className="mt-2">
                <CommentThread postId={p.id} postAuthorId={p.authorId} />
              </div>
            </article>
          );
        })}
      </main>
    </Protected>
  );
}

function formatTime(ts: any) {
  try {
    const date = ts?.toDate ? ts.toDate() : new Date();
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return "now";
  }
}