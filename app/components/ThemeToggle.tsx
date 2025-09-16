"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function apply(next: boolean) {
    const root = document.documentElement, body = document.body;
    if (next) { root.classList.add("dark"); body.classList.add("dark"); }
    else { root.classList.remove("dark"); body.classList.remove("dark"); }
    try { localStorage.setItem("spark-theme", next ? "dark" : "light"); } catch {}
    setIsDark(next);
  }

  return (
    <button
      onClick={() => apply(!isDark)}
      className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}