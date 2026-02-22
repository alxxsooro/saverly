import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="animate-fade-in-up text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl sm:leading-[1.1] md:text-6xl">
          Stop buying online without a{" "}
          <span className="animate-gradient-text inline-block">
            discount code
          </span>
          
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-sm text-neutral-600 sm:text-base animate-fade-in-up-delay-1">
          Saverly uses AI to find active promo codes for Shopify stores. Paste a store URL, get working coupons, and save at checkout no guessing, no expired codes.
        </p>
        <div className="mt-10 animate-fade-in-up-delay-2">
          <Button
            asChild
            size="lg"
            className="text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-200/50"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
