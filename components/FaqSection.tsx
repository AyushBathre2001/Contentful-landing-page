"use client";

import React from "react";
import { getImageUrl, getRichTextPlain } from "@/lib/contentful";
import LayoutWrapper from "@/components/layout-wrapper";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Entry, EntrySkeletonType, Asset } from "contentful";

interface FaqItemFields {
  question?: string;
  answer?: unknown; // Rich Text
}

interface FaqSectionFields {
  heading?: string;
  description?: string;
  backgroundImage?: Asset;
  questions?: Entry<EntrySkeletonType>[]; // Changed from 'faqs'
}

interface FaqSectionProps {
  data: Entry<EntrySkeletonType>;
}

export default function FaqSection({ data }: FaqSectionProps) {
  const fields = data.fields as FaqSectionFields;
  const { heading, description, backgroundImage, questions } = fields;

  // Prepare background image URL safely
  const bgUrl = getImageUrl(backgroundImage);

  const faqItems = questions || [];

  return (
    <section
      className="py-36 bg-cover bg-center relative"
      style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : undefined }}
    >
      <LayoutWrapper className="relative z-10 grid place-items-center gap-12">
        {/* Header Content */}
        <div className="flex flex-col gap-5 2xl:gap-10 items-center">
          <p className="text-[#E87722] text-2xl font-medium">FAQ</p>
          <div className="flex flex-col gap-5 2xl:gap-10 md:max-w-min">
            {heading && (
              <h3 className="font-sans px-3 text-center md:text-nowrap text-white text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold">
                {heading}
              </h3>
            )}
            {description && (
              <p className="font-sans text-center text-[#D1D1D1] md:text-lg 2xl:text-[23px] font-medium">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-5 2xl:gap-10 w-full max-w-3xl 2xl:max-w-4xl">
          {faqItems.length > 0 && (
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => {
                const itemFields = item.fields as FaqItemFields;
                return (
                  <AccordionItem
                    key={item.sys.id || index}
                    value={item.sys.id || `faq-${index}`}
                    className="py-2 shadow-[inset_0_2px_8px_rgba(255,255,255,0.05),inset_0_4px_16px_rgba(255,255,255,0.05)] border border-b border-white/10 last:border-b rounded-4xl bg-white/5"
                  >
                    <AccordionTrigger className="text-white text-lg sm:text-xl lg:text-2xl font-medium px-5 items-center [&>svg]:text-white [&>svg]:w-5 [&>svg]:h-5 hover:no-underline">
                      <div className="flex items-center gap-10 text-start">
                        <span className="opacity-50 font-light">
                          {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        <span>{itemFields.question}</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="text-white px-5 pb-4">
                      <div className="flex gap-10 text-sm sm:text-base lg:text-lg font-light pr-4 sm:pr-10">
                        <span className="text-lg sm:text-xl lg:text-2xl font-medium opacity-0 invisible hidden sm:block">
                          {index < 9 ? `0${index + 1}` : index + 1}
                        </span>

                        <div className="prose prose-invert prose-p:text-[#D1D1D1] max-w-none">
                          {itemFields.answer
                            ? String(getRichTextPlain(itemFields.answer))
                            : null}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </LayoutWrapper>
    </section>
  );
}
