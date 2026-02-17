import { Card } from "@/components/ui/Card";

const testimonials = [
  {
    quote:
      "Found a working code in seconds. Saved 15% on my last order.",
    author: "Alex M.",
    role: "Shopper",
  },
  {
    quote:
      "Finally a tool that actually checks if codes work. No more expired coupons.",
    author: "Jordan K.",
    role: "Frequent buyer",
  },
  {
    quote:
      "Simple and fast. Exactly what I needed before checkout.",
    author: "Sam R.",
    role: "Online shopper",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            What people say
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-neutral-600">
            Early feedback from people who tried Saverly.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={i} variant="bordered" padding="lg">
              <p className="text-neutral-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6">
                <p className="font-medium text-neutral-900">{t.author}</p>
                <p className="text-sm text-neutral-500">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
