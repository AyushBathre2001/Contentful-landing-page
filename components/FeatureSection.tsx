"use client";

import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/contentful";
import LayoutWrapper from "@/components/layout-wrapper";
import { Entry, EntrySkeletonType, Asset } from "contentful";
import { cn } from "@/lib/utils";

// --- Types ---
interface FeatureSectionFields {
  mainContent?: unknown; // Rich Text
  featureImage?: Asset;
  subHeading?: string;
  description?: string;
  // Previously used fields, now likely removed or renamed in data
  content?: string;
  image?: Asset;
}

interface FeatureSectionProps {
  data: Entry<EntrySkeletonType>;
}

export default function FeatureSection({ data }: FeatureSectionProps) {
  const fields = data.fields as FeatureSectionFields;
  // Handle both old and new field names for robustness during migration
  const mainContent = fields.mainContent;
  const imageAsset = fields.featureImage || fields.image;
  const subHeading = fields.subHeading;
  const description = fields.description;

  const imageUrl = getImageUrl(imageAsset);

  return (
    <section className="bg-[#F4F3EC] py-12 md:py-20 lg:py-32 overflow-hidden">
      <LayoutWrapper>
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-24 items-start">
          {/* Left Column: Text Content */}
          <div className="flex-1 flex flex-col gap-8 md:gap-12 lg:gap-16 order-2 lg:order-1">
            {/* 1. Main Rich Text Content */}
            <div className="flex flex-col gap-4 md:gap-6">
              {mainContent &&
                (mainContent as any).content?.map((node: any, idx: number) => {
                  if (node.nodeType === "paragraph") {
                    // Check if the paragraph contains ANY bold text to determine style?
                    // Or style spans individually?
                    // Design looks like bold lines are headings, non-bold are body.

                    return (
                      <p key={idx} className="leading-tight">
                        {node.content?.map((textNode: any, textIdx: number) => {
                          const isBold = textNode.marks?.some(
                            (mark: any) => mark.type === "bold",
                          );

                          // Style Logic:
                          // Bold -> Black, Larger font (Heading-like)
                          // Regular -> Gray, Smaller font (Body-like)

                          return (
                            <span
                              key={textIdx}
                              className={cn(
                                "block mb-2", // Make each text node block to separate lines appropriately
                                isBold
                                  ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#0F0F0F] tracking-tight"
                                  : "text-lg sm:text-xl md:text-2xl font-medium text-[#0F0F0F]/40 tracking-tight",
                              )}
                            >
                              {textNode.value}
                            </span>
                          );
                        })}
                      </p>
                    );
                  }
                  return null;
                })}
            </div>

            {/* 2. Bottom Description Area */}
            <div className="flex flex-col gap-3 md:gap-4 mt-auto pt-4 md:pt-8">
              {subHeading && (
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-[#0F0F0F]">
                  {subHeading}
                </h3>
              )}
              {description && (
                <p className="text-sm sm:text-base md:text-lg text-[#0F0F0F]/70 leading-relaxed max-w-xl">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Feature Image */}
          <div className="flex-1 w-full flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-full max-w-[600px] aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-2xl md:rounded-[32px] overflow-hidden border border-[#0F0F0F]/10 shadow-xl md:shadow-2xl bg-white">
              {imageUrl && (
                <div className="relative w-full h-full">
                  {/* The image in design has some internal padding/mockup look. 
                         If the asset is just the screen, we might need a container. 
                         Assuming asset is the full visual for now. */}
                  <Image
                    src={imageUrl}
                    alt="Feature"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
