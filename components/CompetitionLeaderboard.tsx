"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl, getButtonDetails } from "@/lib/contentful";
import { Button } from "@/components/ui/button";
import { Entry, EntrySkeletonType, Asset } from "contentful";
import { cn } from "@/lib/utils";

interface CompetitorFields {
  companyName?: string;
  score?: string;
  watercolorBarImage?: Asset;
}

interface CompetitionLeaderboardFields {
  heading?: string;
  description?: string;
  reportButton?: Entry<EntrySkeletonType>;
  chartTitle?: string;
  cardBackgroundImage?: Asset;
  competitorsList?: Entry<EntrySkeletonType>[];
}

interface CompetitionLeaderboardProps {
  data: Entry<EntrySkeletonType>;
}

export default function CompetitionLeaderboard({
  data,
}: CompetitionLeaderboardProps) {
  const fields = data.fields as CompetitionLeaderboardFields;
  const {
    heading,
    description,
    reportButton,
    chartTitle,
    cardBackgroundImage,
    competitorsList,
  } = fields;

  // Prepare background URL
  const bgUrl = getImageUrl(cardBackgroundImage);
  const competitors = competitorsList || [];

  const buttonDetails = reportButton ? getButtonDetails(reportButton) : null;

  return (
    <section className="w-full flex justify-center py-12 md:py-20 lg:py-24 relative overflow-hidden bg-[#2D0F05]">
      {/* Background Image Layer */}
      {bgUrl && (
        <div className="absolute inset-0 w-full h-full opacity-100">
          <Image
            src={bgUrl}
            alt="Background"
            fill
            className="object-cover"
            quality={100}
          />
        </div>
      )}

      {/* Main White Card */}
      <div className="relative z-10 w-full max-w-[1000px] mx-4 sm:mx-6 rounded-[32px] overflow-hidden bg-white shadow-2xl">
        <div className="flex flex-col gap-12 p-8 md:p-12 lg:p-16">
          {/* Header Section */}
          <div className="flex flex-col gap-6 max-w-2xl">
            {heading && (
              <h2 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.05] tracking-tight text-[#0F0F0F] font-helvetica-neue font-light">
                {heading}
              </h2>
            )}

            {description && (
              <p className="text-lg md:text-xl leading-relaxed text-[#0F0F0F]/80 max-w-xl font-light">
                {description}
              </p>
            )}

            {buttonDetails && (
              <div className="pt-4">
                <Button
                  asChild
                  className="bg-black text-white hover:bg-gray-800 rounded-lg px-8 py-6 text-lg font-bold transition-all hover:scale-105"
                >
                  <Link href={buttonDetails.url || "#"}>
                    {buttonDetails.text}
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Chart Section */}
          <div className="w-full pt-8">
            {/* Chart Title */}
            {chartTitle && (
              <div className="border-b-2 border-black pb-2 mb-8">
                <h3 className="text-base font-bold text-black uppercase tracking-wide">
                  {chartTitle}
                </h3>
              </div>
            )}

            {/* Competitors List */}
            <div className="flex flex-col gap-8">
              {competitors.map((item, idx) => {
                const competitorFields = item.fields as CompetitorFields;
                const barImageUrl = getImageUrl(
                  competitorFields.watercolorBarImage,
                );

                return (
                  <div
                    key={item.sys.id || idx}
                    className="grid grid-cols-[100px_1fr_40px] md:grid-cols-[140px_1fr_60px] items-center gap-4 py-2"
                  >
                    {/* 1. Name */}
                    <span className="text-sm md:text-lg text-[#0F0F0F] leading-tight font-medium">
                      {competitorFields.companyName}
                    </span>

                    {/* 2. Watercolor Bar (Image) */}
                    <div className="relative h-8 md:h-12 w-full flex items-center justify-start">
                      {barImageUrl && (
                        <div className="relative h-full w-full">
                          <img
                            src={barImageUrl}
                            alt="Score bar"
                            className="h-full object-contain object-left max-w-full"
                          />
                        </div>
                      )}
                    </div>

                    {/* 3. Score */}
                    <span className="text-right text-xl md:text-3xl font-bold text-[#0F0F0F]">
                      {competitorFields.score}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
