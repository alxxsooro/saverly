"use client";

import Link from "next/link";

export function AuthLayout({
  children,
  maxWidth = "max-w-[400px]",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="relative min-h-screen bg-white text-neutral-900 overflow-hidden">
      {/* Soft abstract shapes - light theme */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-neutral-100 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-neutral-50 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 right-0 h-64 w-64 -translate-y-1/2 rounded-full bg-neutral-100/80 blur-2xl"
        aria-hidden
      />

      <div className="relative flex min-h-screen flex-col">
        <header className="px-4 pt-6 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <span aria-hidden>←</span> Home
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-8 sm:px-6">
          <div className={`w-full ${maxWidth}`}>{children}</div>
        </main>

        <footer className="px-4 pb-6 text-center">
          <p className="text-xs text-neutral-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-neutral-600 hover:text-neutral-900 underline">Terms</a>
            {" "}and{" "}
            <a href="#" className="text-neutral-600 hover:text-neutral-900 underline">Privacy Policy</a>.
          </p>
        </footer>
      </div>
    </div>
  );
}
