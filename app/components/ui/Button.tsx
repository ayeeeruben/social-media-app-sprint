"use client";
export default function Button({
  children, type="button", onClick, disabled
}: { children: React.ReactNode; type?: "button"|"submit"; onClick?: () => void; disabled?: boolean; }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium
                 bg-white hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800
                 border-gray-200 dark:border-neutral-800 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
