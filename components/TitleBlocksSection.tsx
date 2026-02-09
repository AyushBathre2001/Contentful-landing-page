"use client";

import TabbedShowcase from "@/components/TabbedShowcase";
import TestimonialGrid from "@/components/TestimonialGrid";
import FeatureSection from "./FeatureSection";
import CompetitionLeaderboard from "./CompetitionLeaderboard";
import { Entry, EntrySkeletonType } from "contentful";
import { getSectionType } from "@/lib/contentful";

interface TitleBlocksSectionFields {
  title?: string;
  backgroundColor?: string;
  contentBlocks?: Entry<EntrySkeletonType>[];
}

interface TitleBlocksSectionProps {
  data: Entry<EntrySkeletonType>;
}

export default function TitleBlocksSection({ data }: TitleBlocksSectionProps) {
  const fields = data.fields as TitleBlocksSectionFields;
  const { title, backgroundColor, contentBlocks } = fields;

  return (
    <section
      className="space-y-20 p-4 pb-8 pt-20"
      style={{
        backgroundColor: backgroundColor || "#1E0903",
      }}
    >
      {/* 1. Glowing Title Effect */}
      {title && (
        <div className="w-full flex justify-center">
          <div className="relative w-fit">
            {/* Blurred/Glowing Layer */}
            <h2 className="absolute text-center text-white font-helvetica-neue text-4xl sm:text-5xl md:text-[56px] font-bold tracking-[-1.04px] max-w-4xl brightness-125 blur-sm select-none opacity-80 left-0 right-0">
              {title}
            </h2>
            {/* Sharp Top Layer */}
            <h2 className="relative text-center text-white font-helvetica-neue text-4xl sm:text-5xl md:text-[56px] font-bold tracking-[-1.04px] max-w-4xl brightness-125">
              {title}
            </h2>
          </div>
        </div>
      )}

      {/* 2. Nested Blocks Renderer */}
      <div className="space-y-20">
        {contentBlocks &&
          contentBlocks.map((block, i) => {
            // Render based on the Contentful content type
            const blockType = getSectionType(block);

            switch (blockType) {
              case "tabbedShowcase":
                return <TabbedShowcase key={block.sys.id || i} data={block} />;

              case "testimonialGrid":
                return <TestimonialGrid key={block.sys.id || i} data={block} />;

              case "featureSection":
                return <FeatureSection key={block.sys.id || i} data={block} />;
              case "competitionLeaderboard":
                return (
                  <CompetitionLeaderboard
                    key={block.sys.id || i}
                    data={block}
                  />
                );

              default:
                // Fallback for unknown types (helpful for debugging)
                console.warn(`Unknown block type: ${blockType}`);
                return null;
            }
          })}
      </div>
    </section>
  );
}
