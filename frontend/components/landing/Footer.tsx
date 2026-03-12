import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-800 bg-black px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link
          href="/"
          className="text-sm font-medium text-white"
        >
          Saverly
        </Link>
        <nav className="flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm text-white/70 hover:text-white"
          >
            How it works
          </a>
          <a href="#faq" className="text-sm text-white/70 hover:text-white">
            FAQ
          </a>
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
      <p className="mx-auto mt-8 max-w-6xl text-center text-sm text-white/60">
        © {year} Saverly. Stop buying online without a discount code.
      </p>
    </footer>
  );
}
