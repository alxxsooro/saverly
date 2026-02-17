"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

type StoreItem = { id: string; domain: string; is_shopify: boolean };

function StoreLogo({ domain }: { domain: string }) {
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
      {!imgFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={favicon}
          alt=""
          className="h-8 w-8 object-contain"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-lg font-semibold text-neutral-400">
          {domain.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function ExplorePage() {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchStores() {
      if (!API_BASE) {
        setError("Missing API URL");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/stores`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail ?? "Failed to load stores");
        setStores(data.stores ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, [API_BASE]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Explore stores
      </h1>
      <p className="mt-2 text-neutral-600">
        Stores we have active discount codes for. Click to see codes.
      </p>

      {loading && (
        <div className="mt-8 rounded-2xl border border-neutral-200 p-8 text-center text-neutral-500">
          Loading stores…
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && stores.length === 0 && (
        <Card variant="bordered" padding="lg" className="mt-8 text-center">
          <p className="text-neutral-600">No stores with active codes yet.</p>
          <p className="mt-2 text-sm text-neutral-500">
            Check back later or search a store by URL in Search.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm font-medium text-neutral-900 underline"
          >
            Search by URL
          </Link>
        </Card>
      )}

      {!loading && !error && stores.length > 0 && (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <li key={store.id}>
              <Link href={`/store/${encodeURIComponent(store.domain)}`}>
                <Card
                  variant="elevated"
                  padding="md"
                  className="h-full transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <StoreLogo domain={store.domain} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900 truncate">
                        {store.domain}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {store.is_shopify ? "Shopify" : "Store"}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
