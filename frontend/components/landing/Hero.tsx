import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl sm:leading-[1.1] md:text-6xl">
          Stop buying online without a discount code.
        </h1>
        <p className="mt-6 text-lg text-neutral-600 sm:text-xl">
          Saverly uses AI to find active promo codes for Shopify stores.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="text-base">
            <Link href="/dashboard">Sign up</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
