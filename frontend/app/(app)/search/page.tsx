"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type InspectResponse = {
  store_id: string;
  domain: string;
  is_shopify: boolean;
};

export default function SearchPage() {
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
    <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Search store
      </h1>
      <p className="mt-2 text-neutral-600">
        Paste any Shopify store URL. If we have active coupons, you’ll see them
        on the store page.
      </p>

      <Card variant="elevated" padding="lg" className="mt-8">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 sm:flex-row sm:items-stretch"
        >
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
          Tip: try{" "}
          <span className="font-medium text-neutral-700">scuffers.com</span>
        </p>
      </Card>
    </main>
  );
}

