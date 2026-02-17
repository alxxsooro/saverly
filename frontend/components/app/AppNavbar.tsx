"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/dashboard", label: "Search" },
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
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/home"
          className="text-xl font-semibold tracking-tight text-neutral-900"
        >
          Saverly
        </Link>
        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 sm:gap-3">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href ||
              (href === "/dashboard" && pathname?.startsWith("/store"));
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors sm:text-base ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
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
          className="rounded-xl px-4 py-2.5 text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 sm:text-base"
        >
          Log out
        </Button>
      </div>
    </header>
  );
}
