"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [savedCodes, setSavedCodes] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const urlParam = useMemo(() => domain, [domain]);

  async function handleRequestCodes() {
    if (!data || !API_BASE) return;
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      window.location.href = `/login?returnUrl=${encodeURIComponent(`/store/${encodeURIComponent(domain)}`)}`;
      return;
    }
    setRequesting(true);
    setError(null);
    setSaveError(null);
    try {
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ domain: data.domain }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.detail ?? "Request failed");
      setRequestSent(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setRequesting(false);
    }
  }

  async function handleSaveCode(code: string) {
    if (!data || !API_BASE) return;
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      window.location.href = `/login?returnUrl=${encodeURIComponent(`/store/${encodeURIComponent(domain)}`)}`;
      return;
    }
    setSaveError(null);
    setSavingCode(code);
    try {
      const res = await fetch(`${API_BASE}/api/saved-codes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ domain: data.domain, code }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.detail ?? "Request failed");
      }
      setSavedCodes((prev) =>
        prev.includes(code) ? prev : [...prev, code]
      );
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSavingCode(null);
    }
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((current) => (current === code ? null : current));
    }, 2000);
  }

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
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [API_BASE, urlParam]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
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

        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">New search</Link>
        </Button>
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
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleCopy(code)}
                    >
                      {copiedCode === code ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={savingCode === code || savedCodes.includes(code)}
                      onClick={() => handleSaveCode(code)}
                    >
                      {savedCodes.includes(code)
                        ? "Saved"
                        : savingCode === code
                        ? "Saving…"
                        : "Save"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            {saveError && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {saveError}
              </p>
            )}
          </div>
        )}

        {!loading && !error && data && data.coupons.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-medium">No active coupons found</h2>
            <p className="mt-2 text-neutral-600">
              We don’t have working codes for this store yet.
            </p>

            {requestSent ? (
              <p className="mt-4 text-sm text-emerald-600">
                Request saved. We&apos;ll notify you when we have codes for this store.
              </p>
            ) : (
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={handleRequestCodes}
                  disabled={requesting}
                >
                  {requesting ? "Saving…" : "Request codes"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard">Try another store</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
