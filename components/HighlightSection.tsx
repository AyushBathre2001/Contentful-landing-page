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
    <LayoutWrapper className="py-24 max-w-[1520px] mx-auto">
      <section className="space-y-19">
        {/* 1. Header (Title & Description) */}
        <div className="flex flex-col items-center gap-4">
          {title && (
            <h2 className="flex flex-col items-center text-center gap-4 font-helvetica-neue font-bold text-6xl leading-15 tracking-[-3.84px] max-w-3xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-lg text-center font-helvetica-neue font-normal text-xl tracking-[-0.5px]">
              {description}
            </p>
          )}
        </div>

        {/* 2. Main Content Split */}
        <div className="relative flex gap-4">
          {/* Left Column: Text & CTA */}
          <div className="flex-1 flex flex-col gap-10 md:pb-44">
            <div className="flex-1 flex flex-col gap-4">
              <div className="font-helvetica-neue text-2xl font-normal leading-7.5 tracking-[-1px] flex flex-col gap-6 text-[#888888]">
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
                      className="font-bold"
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
          <div className="absolute -bottom-24 w-full h-full -z-10 blur-xl lg:relative lg:bottom-0 lg:z-0 lg:blur-none lg:h-auto flex-1 flex">
            {illustrationUrl && (
              <div className="flex justify-center lg:justify-end w-full">
                <div className="relative w-full h-full min-h-100">
                  <Image
                    src={illustrationUrl}
                    alt={
                      (illustration?.fields?.title as string) ||
                      title ||
                      "Illustration"
                    }
                    fill
                    className="object-contain object-bottom-right"
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
