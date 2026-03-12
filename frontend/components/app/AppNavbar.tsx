"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/explore", label: "Explore" },
  { href: "/profile", label: "Profile" },
];

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  async function handleLogOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/home"
          className="text-xl font-semibold tracking-tight text-white"
        >
          Saverly
        </Link>
        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 sm:gap-3">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href ||
              (href === "/search" && pathname?.startsWith("/store"));
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors sm:text-base ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-white/80 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLogOut}
          className="rounded-full px-4 py-2 text-sm text-white/80 hover:bg-neutral-800 hover:text-white sm:text-base"
        >
          Log out
        </Button>
      </div>
    </header>
  );
}
