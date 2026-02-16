"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InspectResponse = {
  store_id: string;
  domain: string;
  is_shopify: boolean;
};

export default function HomePage() {
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

      // Go to results page by domain (stable + clean)
      router.push(`/store/${encodeURIComponent(parsed.domain)}`);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          Find discount codes fast
        </h1>
        <p className="mt-3 text-neutral-600">
          Paste any store URL. If we have active coupons, you’ll see them instantly.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. https://scuffers.com"
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-neutral-900 px-5 py-3 text-white disabled:opacity-60"
          >
            {loading ? "Checking..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 text-sm text-neutral-500">
          Tip: try <span className="font-medium">scuffers.com</span>
        </div>
      </div>
    </main>
  );
}

