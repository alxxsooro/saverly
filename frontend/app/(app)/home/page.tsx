"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

type RequestItem = {
  id: string;
  store_id: string;
  domain: string;
  status: string;
  created_at: string;
  coupons: string[];
};

type SavedCodeItem = {
  id: string;
  store_id: string;
  domain: string;
  code: string;
  created_at: string;
};

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

export default function HomePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [savedCodes, setSavedCodes] = useState<SavedCodeItem[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!API_BASE) {
        setError("Missing NEXT_PUBLIC_API_BASE_URL");
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setLoading(false);
        return;
      }
      try {
        const [codesRes, requestsRes] = await Promise.all([
          fetch(`${API_BASE}/api/saved-codes`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          fetch(`${API_BASE}/api/requests`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
        ]);

        if (codesRes.status === 401 && requestsRes.status === 401) {
          setLoading(false);
          return;
        }

        const codesJson = await codesRes.json();
        const requestsJson = await requestsRes.json();

        if (!codesRes.ok) {
          throw new Error(codesJson?.detail ?? "Failed to load saved codes");
        }
        if (!requestsRes.ok) {
          throw new Error(requestsJson?.detail ?? "Failed to load requests");
        }

        setSavedCodes(codesJson.codes ?? []);
        setRequests(requestsJson.requests ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [API_BASE]);

  const userCodes = savedCodes;
  const pendingOrOther = requests.filter((r) => r.status !== "done");
  const hasCodes = userCodes.length > 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        My codes
      </h1>
      <p className="mt-2 text-neutral-600">
        Codes from stores you requested or that we already have. Request more from any store page when we don’t have codes yet.
      </p>

      {loading && (
        <div className="mt-8 text-neutral-500">Loading your requests…</div>
      )}
      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {hasCodes ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {userCodes.map((item) => (
                <li key={item.id}>
                  <Card variant="elevated" padding="md" className="h-full">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <StoreLogo domain={item.domain} />
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 truncate">
                            {item.domain}
                          </p>
                          <p className="mt-1 font-mono text-sm text-neutral-600 truncate">
                            {item.code}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(item.code);
                          setCopiedId(item.id);
                          setTimeout(() => {
                            setCopiedId((current) =>
                              current === item.id ? null : current
                            );
                          }, 2000);
                        }}
                      >
                        {copiedId === item.id ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <Card variant="bordered" padding="lg" className="mt-8 text-center">
              <p className="text-neutral-600">
                You don’t have any codes from your requests yet.
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Search for a store and use &quot;Request codes&quot; when we don’t have codes, or explore stores that already have codes.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild variant="primary">
                  <Link href="/explore">Explore stores</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/search">Search by URL</Link>
                </Button>
              </div>
            </Card>
          )}

          {pendingOrOther.length > 0 && (
            <section className="mt-12">
              <h2 className="text-lg font-medium text-neutral-900">Your requests</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Stores you asked us to find codes for. We’ll add codes here when they’re ready.
              </p>
              <ul className="mt-4 space-y-3">
                {pendingOrOther.map((r) => (
                  <li key={r.id}>
                    <Card variant="bordered" padding="md" className="flex items-center justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <StoreLogo domain={r.domain} />
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 truncate">
                            {r.domain}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {new Date(r.created_at).toLocaleDateString()} · {r.status}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 capitalize">
                        {r.status}
                      </span>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}
