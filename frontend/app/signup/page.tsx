"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/home");
    }
  }, [user, authLoading, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/home` : undefined,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        requestAnimationFrame(() => {
          router.push("/home");
          router.refresh();
        });
        return;
      }
      setEmailSent(true);
      setLoading(false);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-neutral-500">Loading…</p>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm text-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-neutral-900">
            Saverly
          </Link>
          <Card variant="elevated" padding="lg" className="mt-8">
            <h2 className="text-lg font-semibold text-neutral-900">Check your email</h2>
            <p className="mt-2 text-sm text-neutral-600">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then log in.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link href="/login">Go to log in</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-neutral-900">
            Saverly
          </Link>
          <h1 className="mt-8 text-2xl font-semibold text-neutral-900">Sign up</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-neutral-900 underline">
              Log in
            </Link>
          </p>
        </div>

        <Card variant="elevated" padding="lg" className="mt-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-neutral-500">At least 6 characters</p>
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account…" : "Sign up"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
