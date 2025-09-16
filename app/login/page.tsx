"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/Card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      window.location.href = "/profile";
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card>
        <CardHeader title="Log in" />
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Log in"}
            </Button>
          </form>
          {err && <p className="text-red-600 text-sm text-center mt-2">{err}</p>}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center">
            No account?{" "}
            <Link className="text-blue-600 underline" href="/signup">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
