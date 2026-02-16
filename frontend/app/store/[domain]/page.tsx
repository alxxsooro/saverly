"use client";

import { use, useEffect, useMemo, useState } from "react";

type CouponsResponse = {
  domain: string;
  is_shopify: boolean;
  coupons: string[];
};

export default function StorePage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const resolved = use(params);
  const domain = decodeURIComponent(resolved.domain);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [data, setData] = useState<CouponsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const urlParam = useMemo(() => {
    // backend accepts URL or domain; we pass a domain
    return domain;
  }, [domain]);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError(null);

      if (!API_BASE) {
        setError("Missing NEXT_PUBLIC_API_BASE_URL in .env.local");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/api/coupons?url=${encodeURIComponent(urlParam)}`
        );
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.detail ?? "Request failed");
        }

        setData(json as CouponsResponse);
      } catch (e: any) {
        setError(e?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [API_BASE, urlParam]);

  return (
    <main className="min-h-screen px-6 py-12 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {domain}
            </h1>
            <p className="mt-2 text-neutral-600">
              {loading
                ? "Checking available coupons..."
                : data
                ? data.is_shopify
                  ? "Shopify store detected."
                  : "This store doesn’t look like Shopify (limited support for now)."
                : "—"}
            </p>
          </div>

          <a
            href="/"
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            New search
          </a>
        </div>

        <section className="mt-10">
          {loading && (
            <div className="rounded-2xl border border-neutral-200 p-6">
              <div className="text-neutral-700">Loading…</div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && data && data.coupons.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-medium">Active coupon codes</h2>
              <ul className="mt-4 space-y-3">
                {data.coupons.map((code) => (
                  <li
                    key={code}
                    className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3"
                  >
                    <span className="font-mono text-sm">{code}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(code)}
                      className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white"
                    >
                      Copy
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && !error && data && data.coupons.length === 0 && (
            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-lg font-medium">No active coupons found</h2>
              <p className="mt-2 text-neutral-600">
                We don’t have working codes for this store yet.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  disabled
                  className="rounded-xl bg-neutral-900 px-5 py-3 text-white opacity-60"
                  title="Coming next sprint"
                >
                  Request codes (coming soon)
                </button>

                <a
                  href="/"
                  className="rounded-xl border border-neutral-200 px-5 py-3 hover:bg-neutral-50"
                >
                  Try another store
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
