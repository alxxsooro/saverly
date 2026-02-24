"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Which stores are supported?",
    a: "Right now we focus on Shopify stores. Paste any store URL and we'll detect if it's Shopify and show you active codes we have for that store.",
  },
  {
    q: "Do I need to create an account?",
    a: "You can try searching without an account. Sign up to save your favourite stores and get the most out of Saverly.",
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-neutral-200/80 bg-neutral-50/50 px-4 pt-10 pb-16 sm:px-6 sm:pt-12 sm:pb-20"
    >
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Quick answers to common questions.
          </p>
        </div>

        <div className="mt-10 border border-neutral-200/80 rounded-2xl bg-white shadow-sm overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border-b border-neutral-100 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-neutral-50/80"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-neutral-900 sm:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-200 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 pt-0 text-sm text-neutral-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
