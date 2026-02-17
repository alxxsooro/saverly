"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Profile
      </h1>
      <p className="mt-2 text-neutral-600">
        Your account and preferences.
      </p>

      <Card variant="elevated" padding="lg" className="mt-8">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Signed in with your email. Password change coming later.
          </CardDescription>
        </CardHeader>
        <div className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          {user?.email ?? "—"}
        </div>
      </Card>

      <Card variant="default" padding="lg" className="mt-6">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Notifications, plan, and other options coming later.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
