"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/contentful";
import { Entry, EntrySkeletonType, Asset } from "contentful";
import { Button } from "@/components/ui/button";

// --- Types based on Contentful Schema ---
interface TabFields {
  tabHeading?: string;
  tabDescription?: string;
  tabImage?: Asset;
}

interface TabbedShowcaseFields {
  sectionTitle?: string;
  badgeLabel?: string;
  layoutVariant?: "vertical" | "horizontal";
  tabs?: Entry<EntrySkeletonType>[];
}

interface TabbedShowcaseProps {
  data: Entry<EntrySkeletonType>;
}

// --- Main Component ---
export default function TabbedShowcase({ data }: TabbedShowcaseProps) {
  const fields = data.fields as TabbedShowcaseFields;
  const { tabs, sectionTitle, badgeLabel, layoutVariant = "vertical" } = fields;

  const tabItems = tabs || [];

  // Safety check
  if (!tabItems || tabItems.length === 0) return null;

  // Check if images are different to decide if we need interactivity
  // For the first two cards, images are identical, so it's static.
  // For the third, they might differ.
  // We'll implement a simple hover/click state regardless, but style it as a list.
  const [activeTabId, setActiveTabId] = useState(tabItems[0].sys.id);

  const activeTab =
    tabItems.find((t) => t.sys.id === activeTabId) || tabItems[0];
  const activeTabFields = activeTab.fields as TabFields;
  const activeImage = getImageUrl(activeTabFields.tabImage);

  // Badge Color Logic based on label content (matching designs)
  let badgeColorClass = "bg-orange-500"; // Default (Smart Optimization)
  if (badgeLabel?.toLowerCase().includes("efficiency"))
    badgeColorClass = "bg-teal-400";
  if (badgeLabel?.toLowerCase().includes("support"))
    badgeColorClass = "bg-green-500";

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="bg-white rounded-[32px] p-8 md:p-12 lg:p-16 relative overflow-hidden">
        {/* Layout: Vertical (Image Right) */}
        {layoutVariant === "vertical" && (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex-1 flex flex-col justify-between gap-10">
              <div className="space-y-6">
                {badgeLabel && (
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider w-fit",
                      badgeColorClass,
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-white" />
                    {badgeLabel}
                  </div>
                )}

                {sectionTitle && (
                  <h3 className="font-helvetica-neue text-4xl sm:text-5xl lg:text-[56px] leading-[1.1] font-light tracking-[-1.5px] text-[#0F0F0F]">
                    {sectionTitle}
                  </h3>
                )}
              </div>

              {/* Feature List (Tabs) */}
              <div className="space-y-8 border-t border-gray-200 pt-8">
                {tabItems.map((tab) => {
                  const tFields = tab.fields as TabFields;
                  const isActive = activeTabId === tab.sys.id;
                  return (
                    <div
                      key={tab.sys.id}
                      onMouseEnter={() => setActiveTabId(tab.sys.id)}
                      className="cursor-pointer group"
                    >
                      <h4
                        className={cn(
                          "text-lg font-bold mb-2 transition-colors",
                          isActive ? "text-black" : "text-gray-500",
                        )}
                      >
                        {tFields.tabHeading}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                        {tFields.tabDescription}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div>
                <Button
                  variant="outline"
                  className="rounded-md border-2 border-black font-bold text-black px-8 py-6 hover:bg-black hover:text-white transition-colors"
                >
                  Explore Now
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-[45%] relative min-h-[400px] lg:min-h-[600px] rounded-2xl overflow-hidden bg-gray-100">
              {activeImage && (
                <Image
                  src={activeImage}
                  alt="Feature image"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* Layout: Horizontal (Image Bottom) */}
        {layoutVariant === "horizontal" && (
          <div className="flex flex-col gap-12">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="space-y-6 max-w-3xl">
                {badgeLabel && (
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-black text-xs font-bold uppercase tracking-wider w-fit",
                      badgeColorClass,
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-black" />
                    {badgeLabel}
                  </div>
                )}
                {sectionTitle && (
                  <h3 className="font-helvetica-neue text-4xl sm:text-5xl lg:text-[56px] leading-[1.1] font-light tracking-[-1.5px] text-[#0F0F0F]">
                    {sectionTitle}
                  </h3>
                )}
              </div>

              <Button
                variant="outline"
                className="shrink-0 rounded-md border-2 border-black font-bold text-black px-8 py-6 hover:bg-black hover:text-white transition-colors"
              >
                Explore Now
              </Button>
            </div>

            {/* Image (Middle) */}
            <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden bg-gray-50">
              {activeImage && (
                <Image
                  src={activeImage}
                  alt="Feature image"
                  fill
                  className="object-cover object-top"
                />
              )}
            </div>

            {/* Feature List (Bottom Grid) */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 border-t border-gray-200 pt-8">
              {tabItems.map((tab) => {
                const tFields = tab.fields as TabFields;
                return (
                  <div key={tab.sys.id}>
                    <h4 className="text-lg font-bold mb-3 text-black">
                      {tFields.tabHeading}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tFields.tabDescription}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
