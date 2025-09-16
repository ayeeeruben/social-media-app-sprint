"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) window.location.href = "/profile";
    });
    return () => unsub();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    const t0 = performance.now();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        email,
        name: name || null,
        createdAt: serverTimestamp(),
      });
      setMsg(`Account created in ${Math.round(performance.now() - t0)} ms.`);
      setEmail("");
      setPass("");
      setName("");
      window.location.href = "/profile";
    } catch (e: any) {
      setErr(e?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card>
        <CardHeader title="Create your account" />
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password (min 6 chars)"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Sign up"}
            </Button>
          </form>
          {err && <p className="text-red-600 text-sm text-center mt-2">{err}</p>}
          {msg && <p className="text-green-700 text-sm text-center mt-1">{msg}</p>}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link className="text-blue-600 underline" href="/login">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
