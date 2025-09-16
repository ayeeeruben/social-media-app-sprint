"use client";
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="w-full bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm p-5">{children}</div>;
}
export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h1 className="text-xl font-semibold">{title}</h1>
      {subtitle && <p className="text-sm text-gray-600 dark:text-neutral-400">{subtitle}</p>}
    </div>
  );
}
export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}
export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex items-center gap-2">{children}</div>;
}
