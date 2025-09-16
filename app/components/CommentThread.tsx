"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  addDoc, collection, deleteDoc, doc, limit, onSnapshot,
  orderBy, query, serverTimestamp, updateDoc
} from "firebase/firestore";
import Button from "./ui/Button";
import Input from "./ui/Input";
import LikeButton from "./LikeButton";
import { useAuth } from "../lib/auth";

type Comment = { id:string; authorId:string; authorEmail?:string|null; text:string; createdAt?:any; updatedAt?:any; };

export default function CommentThread({ postId, postAuthorId }:{ postId:string; postAuthorId:string; }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [count, setCount] = useState<number | null>(null); // optional: rough count
  const [text, setText] = useState("");
  const [err, setErr] = useState<string|null>(null);
  const [savingId, setSavingId] = useState<string|null>(null);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [draft, setDraft] = useState("");

  // attach listener ONLY when expanded
  useEffect(() => {
    if (!expanded) return;
    const q = query(collection(db,"posts",postId,"comments"), orderBy("createdAt","asc"), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const rows: Comment[] = [];
      snap.forEach((d)=>rows.push({ id:d.id, ...(d.data() as any) }));
      setComments(rows);
      setCount(rows.length);
    }, (e)=>setErr(e.message));
    return () => unsub();
  }, [expanded, postId]);

  async function addComment(e:React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setErr(null);
    try {
      await addDoc(collection(db,"posts",postId,"comments"), {
        authorId: user.uid, authorEmail: user.email ?? null,
        text: text.trim(), createdAt: serverTimestamp(),
      });
      setText("");
      if (!expanded) setExpanded(true);
    } catch (e:any) { setErr(e.message || "Failed to comment"); }
  }

  const amOwner = (c:Comment)=> user?.uid===c.authorId;
  const postOwner = user?.uid===postAuthorId;
  function startEdit(c:Comment){ setEditingId(c.id); setDraft(c.text); }
  function cancelEdit(){ setEditingId(null); setDraft(""); }
  async function saveEdit(id:string){
    if (!draft.trim()) return;
    setSavingId(id);
    try {
      await updateDoc(doc(db,"posts",postId,"comments",id), { text:draft.trim(), updatedAt:serverTimestamp() });
      setEditingId(null); setDraft("");
    } catch(e:any){ alert(e.message||"Save failed"); } finally{ setSavingId(null); }
  }
  async function removeComment(id:string){
    if (!confirm("Delete this comment?")) return;
    try { await deleteDoc(doc(db,"posts",postId,"comments",id)); }
    catch(e:any){ alert(e.message||"Delete failed"); }
  }

  return (
    <div className="mt-2 space-y-3">
      {/* Toggle row */}
      <div className="flex items-center gap-3">
        <Button onClick={()=>setExpanded(v=>!v)}>{expanded ? "Hide comments" : `Show comments${count!=null?` (${count})`:""}`}</Button>
        {/* Like the whole post’s thread button could go here if desired */}
      </div>

      {/* Quick add (works collapsed too) */}
      <form onSubmit={addComment} className="flex gap-2">
        <Input placeholder="Write a comment…" value={text} onChange={e=>setText(e.target.value)} />
        <Button type="submit" disabled={!user || !text.trim()}>Comment</Button>
      </form>
      {err && <p className="text-red-600 text-sm">{err}</p>}

      {!expanded ? null : (
        <ul className="space-y-2">
          {comments.map((c)=> {
            const canModerate = amOwner(c) || postOwner;
            const editing = editingId===c.id;
            return (
              <li key={c.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-neutral-900/40 dark:border-neutral-800">
                <div className="text-xs text-gray-500 dark:text-neutral-400 flex justify-between">
                  <span>{c.authorEmail ?? "Unknown"}</span>
                  <span>{formatTime(c.createdAt)}{c.updatedAt ? " (edited)":""}</span>
                </div>

                {!editing ? (
                  <p className="mt-1 whitespace-pre-wrap">{c.text}</p>
                ) : (
                  <textarea
                    className="mt-2 w-full min-h-20 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={draft}
                    onChange={(e)=>setDraft(e.target.value)}
                    autoFocus
                  />
                )}

                <div className="mt-2 flex items-center gap-3">
                  {/* comment likes (listener attaches only when expanded) */}
                  <LikeButton postId={postId} commentId={c.id} />

                  {canModerate && (!editing ? (
                    <div className="flex gap-2">
                      {amOwner(c) && <Button onClick={()=>startEdit(c)}>Edit</Button>}
                      <Button onClick={()=>removeComment(c.id)}>Delete</Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={()=>saveEdit(c.id)} disabled={!draft.trim() || savingId===c.id}>
                        {savingId===c.id ? "Saving…" : "Save"}
                      </Button>
                      <Button onClick={cancelEdit}>Cancel</Button>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
          {comments.length===0 && <li className="text-sm text-gray-500 dark:text-neutral-400">No comments yet.</li>}
        </ul>
      )}
    </div>
  );
}

function formatTime(ts:any){
  try {
    const date = ts?.toDate ? ts.toDate() : new Date();
    return new Intl.DateTimeFormat(undefined,{dateStyle:"medium", timeStyle:"short"}).format(date);
  } catch { return "now"; }
}