"use client";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">{children}</div>
  );
}

export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4">{children}</div>;
}
