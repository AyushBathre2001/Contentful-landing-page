"use client";

import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/contentful";
import LayoutWrapper from "@/components/layout-wrapper";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";
import { Entry, EntrySkeletonType, Asset } from "contentful";

interface SponsorFields {
  sponsorName?: string;
  logo?: Asset;
}

interface SponsorsSectionFields {
  internalTitle?: string;
  sponsorsList?: Entry<EntrySkeletonType>[];
}

interface SponsorsSectionProps {
  data: Entry<EntrySkeletonType>;
}

export default function SponsorsSection({ data }: SponsorsSectionProps) {
  const fields = data.fields as SponsorsSectionFields;
  const sponsors = fields.sponsorsList || [];

  if (!sponsors || sponsors.length === 0) return null;

  return (
    <div className="2xl:py-16 py-8">
      <LayoutWrapper>
        <Marquee>
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />

          <MarqueeContent className="flex flex-col">
            {sponsors.map((sponsor, idx) => {
              const sponsorFields = sponsor.fields as SponsorFields;
              const logoUrl = getImageUrl(sponsorFields.logo);
              return (
                <MarqueeItem
                  className="lg:h-20 lg:w-48 h-10 w-36 flex flex-col items-center justify-center"
                  key={sponsor.sys.id || idx}
                >
                  {logoUrl && (
                    <Image
                      alt={sponsorFields.sponsorName || "Sponsor logo"}
                      className="overflow-hidden object-contain"
                      src={logoUrl}
                      height={128}
                      width={128}
                    />
                  )}
                </MarqueeItem>
              );
            })}
          </MarqueeContent>
        </Marquee>
      </LayoutWrapper>
    </div>
  );
}
