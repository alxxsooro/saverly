const testimonials = [
  { quote: "Found a working code in seconds. Saved 15% on my last order.", author: "Alex M." },
  { quote: "Finally a tool that actually checks if codes work. No more expired coupons.", author: "Jordan K." },
  { quote: "Simple and fast. Exactly what I needed before checkout.", author: "Sam R." },
  { quote: "I use it every time I buy from a Shopify store. Saves me money every week.", author: "Morgan L." },
  { quote: "No more googling for codes that don't work. Saverly just works.", author: "Casey T." },
  { quote: "Clean and straightforward. Found a code for my favourite store in one click.", author: "Riley J." },
];

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="flex h-[180px] w-[300px] shrink-0 flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/80 sm:h-[200px] sm:w-[320px]">
      <p className="min-h-0 flex-1 overflow-hidden text-sm leading-relaxed text-neutral-700 line-clamp-4 sm:text-base">&ldquo;{quote}&rdquo;</p>
      <p className="mt-4 shrink-0 font-medium text-neutral-900">{author}</p>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-neutral-50/50 px-4 pt-10 pb-10 sm:px-6 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            What people say
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-neutral-600">
            Early feedback from people who tried Saverly.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden">
          {/* Difuminado izquierda */}
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-neutral-50/50 to-transparent sm:w-20"
            aria-hidden
          />
          {/* Difuminado derecha */}
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-neutral-50/50 to-transparent sm:w-20"
            aria-hidden
          />

          <div className="animate-marquee-left flex w-max gap-5">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={i} quote={t.quote} author={t.author} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
