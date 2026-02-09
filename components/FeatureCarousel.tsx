"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/contentful";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Entry, EntrySkeletonType, Asset } from "contentful";

interface CarouselItemFields {
  title?: string;
  description?: string;
  image?: Asset;
}

interface FeatureCarouselFields {
  heading?: string;
  subHeading?: string; // Note: camelCase from Contentful
  items?: Entry<EntrySkeletonType>[];
}

interface FeatureCarouselProps {
  data: Entry<EntrySkeletonType>[] | Entry<EntrySkeletonType>;
}

export default function FeatureCarousel({ data }: FeatureCarouselProps) {
  // Handle both array and single object
  const carouselData = Array.isArray(data) ? data[0] : data;

  if (!carouselData?.fields) {
    console.error("FeatureCarousel: Invalid data structure", data);
    return null;
  }

  const fields = carouselData.fields as FeatureCarouselFields;
  const { heading, items, subHeading } = fields;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const carouselItems = items || [];

  // Handle slide changes
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  }, [carouselItems.length]);

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length,
    );
  };

  // Auto-play logic (pauses on hover)
  useEffect(() => {
    if (!isAutoPlaying || carouselItems.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, carouselItems.length]);

  if (!carouselItems || carouselItems.length === 0) return null;

  const activeItem = carouselItems[activeIndex];
  const activeItemFields = activeItem?.fields as CarouselItemFields;

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 py-16 relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* 1. Main Heading */}
      {heading && (
        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-12 tracking-wide uppercase">
          {heading}
        </h2>
      )}

      {/* 2. Top Tabs (Navigation) */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-10 border-b border-white/10 pb-4">
        {carouselItems.map((item, index) => {
          const itemFields = item.fields as CarouselItemFields;
          return (
            <button
              key={item.sys.id || index}
              onClick={() => setActiveIndex(index)}
              className={`text-sm md:text-lg font-medium transition-all duration-300 pb-2 relative ${
                activeIndex === index
                  ? "text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {itemFields.title}
              {/* Active Underline Indicator */}
              <span
                className={`absolute -bottom-4.25 left-0 w-full h-0.5 bg-blue-500 transition-transform duration-300 ${
                  activeIndex === index ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* 3. Main Content Area */}
      <div className="relative group">
        {/* Navigation Arrows (Absolute Positioned) */}
        <button
          onClick={prevSlide}
          className="absolute -left-5 md:-left-15 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors hidden md:block"
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute -right-5 md:-right-15 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors hidden md:block"
          aria-label="Next slide"
        >
          <ChevronRight size={32} />
        </button>

        {/* Image Container */}
        <div className="relative w-full aspect-16/10 md:aspect-2/1 rounded-xl overflow-hidden shadow-2xl">
          {carouselItems.map((item, index) => {
            const itemFields = item.fields as CarouselItemFields;
            const imageUrl = getImageUrl(itemFields.image);
            return (
              <div
                key={item.sys.id || index}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform ${
                  activeIndex === index
                    ? "opacity-100 translate-x-0 scale-100"
                    : "opacity-0 translate-x-4 scale-95"
                }`}
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={
                      (itemFields.image?.fields?.title as string) ||
                      itemFields.title ||
                      "Carousel image"
                    }
                    fill
                    className="object-contain p-4 md:p-8"
                    priority={index === 0}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center min-h-15">
        <p className="text-white text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
          {subHeading}
        </p>
      </div>
    </div>
  );
}
