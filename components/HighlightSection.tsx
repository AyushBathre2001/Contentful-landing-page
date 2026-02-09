import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getImageUrl,
  getButtonDetails,
  getRichTextPlain,
} from "@/lib/contentful";
import LayoutWrapper from "@/components/layout-wrapper";
import { Button } from "@/components/ui/button";
import { Entry, EntrySkeletonType, Asset } from "contentful";

interface HighlightSectionFields {
  title?: string;
  description?: string;
  mainContent?: unknown; // Rich Text
  callToAction?: Entry<EntrySkeletonType>; // Single button
  illustration?: Asset;
}

interface HighlightSectionProps {
  data: Entry<EntrySkeletonType>;
}

export default function HighlightSection({ data }: HighlightSectionProps) {
  const fields = data.fields as HighlightSectionFields;
  const { title, description, mainContent, callToAction, illustration } =
    fields;

  const illustrationUrl = getImageUrl(illustration);

  return (
    <LayoutWrapper className="py-12 md:py-16 lg:py-24 max-w-[1520px] mx-auto">
      <section className="space-y-12 md:space-y-16 lg:space-y-19">
        {/* 1. Header (Title & Description) */}
        <div className="flex flex-col items-center gap-3 md:gap-4">
          {title && (
            <h2 className="flex flex-col items-center text-center gap-2 md:gap-4 font-helvetica-neue font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight md:leading-15 tracking-tight md:tracking-[-3.84px] max-w-3xl px-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-lg text-center font-helvetica-neue font-normal text-base sm:text-lg md:text-xl tracking-tight md:tracking-[-0.5px] px-4">
              {description}
            </p>
          )}
        </div>

        {/* 2. Main Content Split */}
        <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-4">
          {/* Left Column: Text & CTA */}
          <div className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-10 md:pb-0 lg:pb-44 px-4 md:px-0">
            <div className="flex-1 flex flex-col gap-4">
              <div className="font-helvetica-neue text-lg sm:text-xl md:text-2xl font-normal leading-relaxed md:leading-7.5 tracking-tight md:tracking-[-1px] flex flex-col gap-4 md:gap-6 text-[#888888]">
                {mainContent &&
                  (mainContent as any).content?.map(
                    (node: any, idx: number) => {
                      if (node.nodeType === "paragraph") {
                        return (
                          <p key={idx}>
                            {node.content?.map(
                              (textNode: any, textIdx: number) => {
                                const isBold = textNode.marks?.some(
                                  (mark: any) => mark.type === "bold",
                                );
                                return (
                                  <span
                                    key={textIdx}
                                    className={
                                      isBold ? "text-black font-bold" : ""
                                    }
                                  >
                                    {textNode.value}
                                  </span>
                                );
                              },
                            )}
                          </p>
                        );
                      }
                      return null;
                    },
                  )}
              </div>
            </div>

            {/* CTA Button */}
            {callToAction && (
              <div className="flex gap-4">
                {(() => {
                  const { text, url, variant } = getButtonDetails(callToAction);
                  return (
                    <Button
                      variant={
                        variant === "secondary" ? "secondary" : "default"
                      }
                      className="font-bold w-full sm:w-auto"
                      asChild
                    >
                      <Link href={url || "#"}>{text}</Link>
                    </Button>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Right Column: Illustration */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:absolute lg:-bottom-24 lg:w-full lg:h-full lg:-z-10 lg:blur-xl xl:relative xl:bottom-0 xl:z-0 xl:blur-none xl:h-auto flex-1 flex px-4 md:px-0">
            {illustrationUrl && (
              <div className="flex justify-center lg:justify-end w-full">
                <div className="relative w-full h-full lg:min-h-100">
                  <Image
                    src={illustrationUrl}
                    alt={
                      (illustration?.fields?.title as string) ||
                      title ||
                      "Illustration"
                    }
                    fill
                    className="object-contain object-center lg:object-bottom-right"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
