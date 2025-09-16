"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import { collection, doc, onSnapshot, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../lib/auth";
import Button from "./ui/Button";

export default function LikeButton({ postId, commentId }: { postId: string; commentId?: string }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  // build likes collection path
  const likesCol = useMemo(() => (
    commentId
      ? collection(db, "posts", postId, "comments", commentId, "likes")
      : collection(db, "posts", postId, "likes")
  ), [postId, commentId]);

  useEffect(() => {
    // count listener
    const unsubCount = onSnapshot(likesCol, (snap) => setCount(snap.size));
    // current user like listener
    let unsubMine = () => {};
    if (user) {
      const myRef = commentId
        ? doc(db, "posts", postId, "comments", commentId, "likes", user.uid)
        : doc(db, "posts", postId, "likes", user.uid);
      unsubMine = onSnapshot(myRef, (snap) => setLiked(snap.exists()));
    } else {
      setLiked(false);
    }
    return () => { unsubCount(); unsubMine(); };
  }, [likesCol, postId, commentId, user]);

  async function toggle() {
    if (!user) return alert("Please log in to like.");
    const ref = commentId
      ? doc(db, "posts", postId, "comments", commentId, "likes", user.uid)
      : doc(db, "posts", postId, "likes", user.uid);
    if (liked) await deleteDoc(ref);
    else await setDoc(ref, { createdAt: serverTimestamp() });
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={toggle}>{liked ? "Unlike" : "Like"}</Button>
      <span className="text-sm text-gray-600">{count}</span>
    </div>
  );
}
