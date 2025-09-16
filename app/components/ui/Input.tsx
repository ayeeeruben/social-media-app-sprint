"use client";
export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border px-3 py-2 text-sm
                 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                 dark:bg-neutral-900 dark:border-neutral-800"
    />
  );
}
