import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

const steps = [
  {
    step: "1",
    title: "Paste the store URL",
    description:
      "Enter any Shopify store URL or domain in the search. We detect the store and check our database for active codes so you don’t have to guess.",
  },
  {
    step: "2",
    title: "We find active codes",
    description:
      "Saverly continuously verifies promo codes so you only see codes that are currently working. No more expired or invalid coupons.",
  },
  {
    step: "3",
    title: "Copy and save",
    description:
      "Copy the code at checkout and get the discount. Free to use and no sign-up required to try it.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-neutral-200/80 bg-neutral-50/50 px-4 pt-10 pb-8 sm:px-6 sm:pt-12 sm:pb-10"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 max-w-lg mx-auto text-sm text-neutral-600">
            Three simple steps to never overpay again. Paste a store link, get working codes, and copy at checkout.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((item, i) => (
            <Card
              key={item.step}
              variant="default"
              padding="md"
              className="animate-fade-in-up"
              style={{
                animationDelay: `${0.2 + i * 0.12}s`,
                animationFillMode: "both",
                animationDuration: "0.6s",
              }}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-xs font-medium text-white">
                {item.step}
              </span>
              <CardHeader className="mt-4 mb-0">
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription className="mt-1.5 text-sm text-neutral-600">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
