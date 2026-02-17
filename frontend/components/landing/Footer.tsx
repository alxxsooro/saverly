import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200/80 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link
          href="/"
          className="text-sm font-medium text-neutral-900"
        >
          Saverly
        </Link>
        <nav className="flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            FAQ
          </a>
          <Link
            href="/dashboard"
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Sign up
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-center text-sm text-neutral-500">
        © {year} Saverly. Stop buying online without a discount code.
      </p>
    </footer>
  );
}
