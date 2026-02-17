"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-neutral-900"
        >
          Saverly
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href="#how-it-works"
            className="hidden text-sm text-neutral-600 hover:text-neutral-900 sm:inline-block"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="hidden text-sm text-neutral-600 hover:text-neutral-900 sm:inline-block"
          >
            FAQ
          </a>
          <Link
            href="/dashboard"
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/dashboard">Sign up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
