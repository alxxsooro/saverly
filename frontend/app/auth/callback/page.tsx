"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/home";

    // Supabase puede devolver la sesión como ?code=... (PKCE) o como #access_token=... (implicit)
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const hashParams = hash ? new URLSearchParams(hash.replace(/^#/, "")) : null;
    const accessToken = hashParams?.get("access_token");
    const refreshToken = hashParams?.get("refresh_token");
    const hasHashSession = accessToken && refreshToken;

    if (!code && !hasHashSession) {
      const errorDescription = hashParams?.get("error_description");
      setError(errorDescription ?? "Missing authorization code");
      return;
    }

    let cancelled = false;

    async function finishLogin() {
      try {
        const supabase = createClient();
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (exchangeError) {
            setError(exchangeError.message);
            return;
          }
        } else if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (cancelled) return;
          if (sessionError) {
            setError(sessionError.message);
            return;
          }
        }
        if (cancelled) return;
        router.replace(next);
        router.refresh();
      } catch {
        if (!cancelled) setError("Something went wrong");
      }
    }

    finishLogin();
    return () => {
      cancelled = true;
    };
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4">
        <p className="text-center text-red-600">{error}</p>
        <a href="/login" className="text-sky-600 underline hover:no-underline">
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-neutral-500">Signing you in…</p>
    </div>
  );
}
