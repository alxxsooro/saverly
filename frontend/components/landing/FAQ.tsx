const faqs = [
  {
    q: "Which stores are supported?",
    a: "Right now we focus on Shopify stores. Paste any store URL and we'll detect if it's Shopify and show you active codes we have for that store.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. You can search for codes and copy them without signing up.",
  },
  {
    q: "How do you know the codes work?",
    a: "We continuously collect and verify promo codes. Only codes marked as active are shown, so you get the best chance of a valid discount.",
  },
  {
    q: "What if there are no codes for my store?",
    a: "We're adding new stores and codes over time. You can try another store or check back later.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-neutral-200/80 bg-neutral-50/50 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <ul className="mt-14 space-y-10">
          {faqs.map((faq, i) => (
            <li key={i}>
              <h3 className="text-lg font-medium text-neutral-900">{faq.q}</h3>
              <p className="mt-2 text-neutral-600 leading-relaxed">{faq.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
