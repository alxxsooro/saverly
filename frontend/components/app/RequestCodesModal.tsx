"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

type RequestCodesModalProps = {
  open: boolean;
  onClose: () => void;
  domain: string;
  /** When logged in, we use this and don't show email field */
  userEmail: string | null;
  accessToken: string | null;
  apiBase: string;
  onSuccess: () => void;
};

type ModalState = "form" | "submitting" | "success" | "error";

export function RequestCodesModal({
  open,
  onClose,
  domain,
  userEmail,
  accessToken,
  apiBase,
  onSuccess,
}: RequestCodesModalProps) {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [state, setState] = useState<ModalState>("form");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoggedIn = Boolean(accessToken);
  const needsEmail = !isLoggedIn;
  const emailError = needsEmail && emailTouched && (!email.trim() || !isValidEmail(email.trim()));
  const canSubmit =
    state === "form" &&
    (isLoggedIn || (email.trim() !== "" && isValidEmail(email.trim())));

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit || !apiBase) return;

      setState("submitting");
      setErrorMessage(null);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (accessToken) {
          headers.Authorization = `Bearer ${accessToken}`;
        }

        const body: { domain: string; email?: string } = { domain };
        if (needsEmail && email.trim()) {
          body.email = email.trim();
        }

        const res = await fetch(`${apiBase}/api/requests`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.detail ?? "Request failed");
        }

        setState("success");
        onSuccess();
      } catch (e: unknown) {
        setState("error");
        setErrorMessage(e instanceof Error ? e.message : "Something went wrong");
      }
    },
    [canSubmit, apiBase, accessToken, domain, needsEmail, email, onSuccess]
  );

  const handleClose = useCallback(() => {
    onClose();
    // Reset after animation so next open is fresh
    setTimeout(() => {
      setState("form");
      setErrorMessage(null);
      setEmail("");
      setEmailTouched(false);
    }, 200);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-codes-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-xl">
        <h2 id="request-codes-title" className="text-xl font-semibold text-white">
          Request codes
        </h2>

        {state === "success" ? (
          <div className="mt-4 space-y-4">
            <p className="text-white/80">
              Request created. We&apos;ll notify you when we have codes for this store.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleClose} className="bg-white text-black hover:bg-neutral-200">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <p className="text-white/80">
              We don&apos;t have active coupons for <strong className="text-white">{domain}</strong> yet.
              Submit a request and we&apos;ll notify you when codes are available.
            </p>

            {isLoggedIn && userEmail ? (
              <p className="rounded-xl bg-neutral-800 px-4 py-3 text-sm text-white/90">
                We&apos;ll notify you at <strong className="text-white">{userEmail}</strong>
              </p>
            ) : (
              <div>
                <label htmlFor="request-email" className="block text-sm font-medium text-white/90">
                  Email
                </label>
                <Input
                  id="request-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailTouched(true);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  error={Boolean(emailError)}
                  disabled={state === "submitting"}
                  className="mt-1"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-400" role="alert">
                    {!email.trim() ? "Email is required" : "Enter a valid email address"}
                  </p>
                )}
              </div>
            )}

            {state === "error" && errorMessage && (
              <p className="rounded-xl border border-red-500/50 bg-red-950/50 px-4 py-3 text-sm text-red-300" role="alert">
                {errorMessage}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                disabled={!canSubmit || state === "submitting"}
                className="bg-white text-black hover:bg-neutral-200"
              >
                {state === "submitting" ? "Submitting…" : "Submit request"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} disabled={state === "submitting"} className="border-white/40 text-white hover:bg-white/10">
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
