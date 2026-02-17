"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const userCodes: { store: string; code: string; discount?: string }[] = [];
  const hasCodes = userCodes.length > 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        My codes
      </h1>
      <p className="mt-2 text-neutral-600">
        Codes you’ve saved or unlocked. In the future you’ll get access to more by upgrading your plan.
      </p>

      {hasCodes ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {userCodes.map((item, i) => (
            <li key={i}>
              <Card variant="elevated" padding="md" className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-neutral-900">{item.store}</p>
                    <p className="mt-1 font-mono text-sm text-neutral-600">{item.code}</p>
                    {item.discount && (
                      <p className="mt-1 text-sm text-emerald-600">{item.discount}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(item.code)}
                  >
                    Copy
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card variant="bordered" padding="lg" className="mt-8 text-center">
          <p className="text-neutral-600">
            You don’t have any saved codes yet.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Explore stores and unlock codes, or search for a store to see available discounts.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="primary">
              <Link href="/explore">Explore stores</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Search by URL</Link>
            </Button>
          </div>
        </Card>
      )}
    </main>
  );
}
