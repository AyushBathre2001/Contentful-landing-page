"use client";

import { getImageUrl, getButtonDetails } from "@/lib/contentful";
import Image from "next/image";
import Link from "next/link";
import LayoutWrapper from "@/components/layout-wrapper";
import { Button } from "@/components/ui/button";
import FeatureCarousel from "./FeatureCarousel";
import { Entry, EntrySkeletonType, Asset } from "contentful";
import { cn } from "@/lib/utils";

interface HeroFields {
  headline?: string;
  subHeadline?: string;
  bgImage?: Asset;
  buttons?: Entry<EntrySkeletonType>[];
  featureCarousel?: Entry<EntrySkeletonType>[];
}

interface HeroProps {
  data: Entry<EntrySkeletonType>;
}

export default function Hero({ data }: HeroProps) {
  const fields = data.fields as HeroFields;
  const { headline, subHeadline, bgImage, buttons, featureCarousel } = fields;

  const bgImageUrl = getImageUrl(bgImage);

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col justify-end pb-24 lg:pb-32 overflow-hidden">
      {/* 1. Background Image */}
      {bgImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImageUrl}
            alt={headline || "Hero background"}
            fill
            className="object-cover opacity-80"
            priority
            quality={90}
          />
          {/* Gradient Overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      )}

      {/* 2. Content Wrapper */}
      <LayoutWrapper className="relative z-10 w-full pt-40 lg:pt-40 max-w-[1520px] mx-auto">
        <div className="flex flex-col gap-10 max-w-4xl">
          {/* Headline */}
          {headline && (
            <h1 className="font-helvetica-neue font-medium text-5xl md:text-6xl lg:text-[80px] leading-[1.05] tracking-tight">
              {headline}
            </h1>
          )}

          {/* Divider Line */}
          <div className="w-full h-[1px] bg-white/30 max-w-2xl" />

          {/* Subheadline & Description Area */}
          <div className="max-w-2xl">
            {subHeadline && (
              <p className="font-helvetica-neue text-lg md:text-2xl text-white/90 leading-relaxed font-light">
                {subHeadline}
              </p>
            )}
          </div>

          {/* Buttons */}
          {buttons && buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4">
              {buttons.map((btn, idx) => {
                const { text, url, variant } = getButtonDetails(btn);
                const isOutline = variant === "secondary";

                return (
                  <Button
                    key={btn.sys.id || idx}
                    asChild
                    className={cn(
                      "h-14 px-8 rounded-lg text-lg font-bold transition-transform hover:scale-105",
                      isOutline
                        ? "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
                        : "bg-white text-black hover:bg-gray-100 border-2 border-white",
                    )}
                  >
                    <Link href={url || "#"}>{text}</Link>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </LayoutWrapper>

      {/* Feature Carousel (if any) - could be positioned absolutely or below */}
      {featureCarousel && (
        <div className="md:mt-24 mt-10">
          <FeatureCarousel data={featureCarousel} />
        </div>
      )}
    </section>
  );
}
