"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type InspectResponse = {
  store_id: string;
  domain: string;
  is_shopify: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const value = url.trim();
    if (!value) {
      setError("Please enter a store URL or domain.");
      return;
    }
    if (!API_BASE) {
      setError("Missing NEXT_PUBLIC_API_BASE_URL in .env.local");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/store/inspect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail ?? "Request failed");
      }

      const parsed = data as InspectResponse;
      router.push(`/store/${encodeURIComponent(parsed.domain)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-neutral-900"
          >
            Saverly
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-neutral-900"
            >
              Dashboard
            </Link>
            {/* Log out / Login will go here when auth is ready */}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Find discount codes
        </h1>
        <p className="mt-2 text-neutral-600">
          Paste any Shopify store URL. If we have active coupons, you’ll see them instantly.
        </p>

        <Card variant="elevated" padding="lg" className="mt-8">
          <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://scuffers.com"
              error={!!error}
              className="sm:min-w-0"
            />
            <Button
              type="submit"
              disabled={loading}
              size="md"
              className="shrink-0"
            >
              {loading ? "Checking…" : "Search"}
            </Button>
          </form>
          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <p className="mt-4 text-sm text-neutral-500">
            Tip: try <span className="font-medium text-neutral-700">scuffers.com</span>
          </p>
        </Card>
      </main>
    </div>
  );
}
