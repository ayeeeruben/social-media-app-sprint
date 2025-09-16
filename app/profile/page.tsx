"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "../lib/auth";
import Protected from "../components/Protected";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data() as any;
          setName(d.name || "");
          setBio(d.bio || "");
        }
      } catch (e: any) {
        setErr(e.message || "Failed to load profile");
      }
    })();
  }, [user]);

  async function saveProfile() {
    if (!user) return;
    setMsg(null); setErr(null);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { uid: user.uid, email: user.email, name, bio, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setMsg("Profile saved.");
    } catch (e: any) {
      setErr(e.message || "Save failed");
    }
  }

  async function handleSignOut() {
    await signOut(auth);
    window.location.href = "/login";
  }

  return (
    <Protected>
      <main className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader title="Your Profile" />
          <CardContent>
            <div className="space-y-3">
              <label className="block text-sm">Email</label>
              <Input value={user?.email ?? ""} disabled />
              <label className="block text-sm">Name</label>
              <Input value={name} onChange={e=>setName(e.target.value)} />
              <label className="block text-sm">Bio</label>
              <textarea
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={bio}
                onChange={e=>setBio(e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <Button onClick={saveProfile}>Save</Button>
                <Button onClick={handleSignOut}>Sign out</Button>
              </div>
              {msg && <p className="text-green-700 text-sm">{msg}</p>}
              {err && <p className="text-red-600 text-sm">{err}</p>}
            </div>
          </CardContent>
          <CardFooter />
        </Card>
      </main>
    </Protected>
  );
}
