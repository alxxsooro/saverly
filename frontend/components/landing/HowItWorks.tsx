import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

const steps = [
  {
    step: "1",
    title: "Paste the store URL",
    description:
      "Enter any Shopify store URL or domain. We detect the store and check our database for active codes.",
  },
  {
    step: "2",
    title: "We find active codes",
    description:
      "Saverly continuously verifies promo codes so you only see codes that are currently working.",
  },
  {
    step: "3",
    title: "Copy and save",
    description:
      "Copy the code at checkout and get the discount. No sign-up required.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-neutral-200/80 bg-neutral-50/50 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-neutral-600">
            Three steps to never overpay again.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((item) => (
            <Card key={item.step} variant="default" padding="lg">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-sm font-medium text-white">
                {item.step}
              </span>
              <CardHeader className="mt-6 mb-0">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="mt-2 text-base text-neutral-600">
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
