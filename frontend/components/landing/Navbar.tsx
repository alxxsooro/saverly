"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
        >
          Saverly
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href="#how-it-works"
            className="hidden text-sm text-white/80 hover:text-white sm:inline-block"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="hidden text-sm text-white/80 hover:text-white sm:inline-block"
          >
            FAQ
          </a>
          <Link href="/login" className="text-sm text-white/80 hover:text-white">
            Log in
          </Link>
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="bg-white hover:bg-white/90 border border-neutral-300"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
