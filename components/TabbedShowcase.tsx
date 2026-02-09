"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/contentful";
import * as TabsPrimitive from "@radix-ui/react-tabs";
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

  const [selectedTab, setSelectedTab] = useState(tabItems[0]?.sys.id || "0");
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance logic
  const advanceTab = () => {
    setSelectedTab((prev) => {
      const currentIndex = tabItems.findIndex((t) => t.sys.id === prev);
      const nextIndex = (currentIndex + 1) % tabItems.length;
      return tabItems[nextIndex]?.sys.id || "0";
    });
  };

  // Badge Color Logic
  let badgeColorClass = "bg-orange-500";
  if (badgeLabel?.toLowerCase().includes("efficiency"))
    badgeColorClass = "bg-teal-400";
  if (badgeLabel?.toLowerCase().includes("support"))
    badgeColorClass = "bg-green-500";

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="bg-white rounded-[32px] p-8 md:p-12 lg:p-16 relative overflow-hidden">
        <TabsPrimitive.Root
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full flex flex-col gap-12"
        >
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

                {/* Interactive Tabs List */}
                <TabsPrimitive.List
                  className="space-y-4 border-t border-gray-200 pt-8 flex flex-col"
                  onPointerEnter={() => setIsPaused(true)}
                  onPointerLeave={() => setIsPaused(false)}
                >
                  {tabItems.map((tab) => {
                    const tFields = tab.fields as TabFields;
                    return (
                      <TabsPrimitive.Trigger
                        key={tab.sys.id}
                        value={tab.sys.id}
                        className="group relative flex flex-col items-start p-4 text-left outline-none rounded-xl transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        {/* Progress Bar (Only visible when active) */}
                        <TabProgress
                          isActive={selectedTab === tab.sys.id}
                          isPaused={isPaused}
                          onComplete={advanceTab}
                        />

                        <h4 className="text-lg font-bold mb-2 text-gray-400 group-data-[state=active]:text-black transition-colors">
                          {tFields.tabHeading}
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md group-data-[state=active]:text-gray-600 transition-colors">
                          {tFields.tabDescription}
                        </p>
                      </TabsPrimitive.Trigger>
                    );
                  })}
                </TabsPrimitive.List>

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

              {/* Right Image Display */}
              <div className="lg:w-[45%] relative min-h-[400px] lg:min-h-[600px] rounded-2xl overflow-hidden bg-gray-100">
                <AnimatePresence mode="wait">
                  {tabItems.map((tab) => {
                    const tFields = tab.fields as TabFields;
                    const imageUrl = getImageUrl(tFields.tabImage);
                    return (
                      selectedTab === tab.sys.id && (
                        <TabsPrimitive.Content
                          key={tab.sys.id}
                          value={tab.sys.id}
                          asChild
                          forceMount
                        >
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.98,
                              filter: "blur(4px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.98,
                              filter: "blur(4px)",
                            }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 w-full h-full"
                          >
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={tFields.tabHeading || "Tab image"}
                                fill
                                className="object-cover"
                              />
                            )}
                          </motion.div>
                        </TabsPrimitive.Content>
                      )
                    );
                  })}
                </AnimatePresence>
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
                <AnimatePresence mode="wait">
                  {tabItems.map((tab) => {
                    const tFields = tab.fields as TabFields;
                    const imageUrl = getImageUrl(tFields.tabImage);
                    return (
                      selectedTab === tab.sys.id && (
                        <TabsPrimitive.Content
                          key={tab.sys.id}
                          value={tab.sys.id}
                          asChild
                          forceMount
                        >
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.98,
                              filter: "blur(4px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.98,
                              filter: "blur(4px)",
                            }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 w-full h-full"
                          >
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={tFields.tabHeading || "Tab image"}
                                fill
                                className="object-cover object-top"
                              />
                            )}
                          </motion.div>
                        </TabsPrimitive.Content>
                      )
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Interactive Tabs Grid (Bottom) */}
              <TabsPrimitive.List
                className="grid md:grid-cols-3 gap-8 md:gap-12 border-t border-gray-200 pt-8"
                onPointerEnter={() => setIsPaused(true)}
                onPointerLeave={() => setIsPaused(false)}
              >
                {tabItems.map((tab) => {
                  const tFields = tab.fields as TabFields;
                  return (
                    <TabsPrimitive.Trigger
                      key={tab.sys.id}
                      value={tab.sys.id}
                      className="group relative flex flex-col items-start text-left outline-none transition-opacity data-[state=inactive]:opacity-50"
                    >
                      {/* Progress Bar (Only visible when active) */}
                      <TabProgress
                        isActive={selectedTab === tab.sys.id}
                        isPaused={isPaused}
                        onComplete={advanceTab}
                      />

                      <h4 className="text-lg font-bold mb-3 text-black">
                        {tFields.tabHeading}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {tFields.tabDescription}
                      </p>
                    </TabsPrimitive.Trigger>
                  );
                })}
              </TabsPrimitive.List>
            </div>
          )}
        </TabsPrimitive.Root>
      </div>
    </div>
  );
}

// --- Helper Component for the Progress Bar ---
function TabProgress({
  isActive,
  isPaused,
  onComplete,
}: {
  isActive: boolean;
  isPaused: boolean;
  onComplete: () => void;
}) {
  const width = useMotionValue(0);
  const widthPx = useTransform(width, (v) => `${v}%`);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      progressRef.current = 0;
      width.set(0);
      lastTimeRef.current = null;
      return;
    }

    function step(timestamp: number) {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!isPaused) {
        progressRef.current += delta / 5000;

        if (progressRef.current >= 1) {
          onComplete();
          return;
        }
        width.set(progressRef.current * 100);
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, isPaused, onComplete, width]);

  if (!isActive) return null;

  return (
    <div className="relative h-0.5 w-full bg-gray-200 mb-4 overflow-hidden rounded-full">
      <motion.div
        className="absolute top-0 left-0 h-full bg-black z-10"
        style={{ width: widthPx }}
      />
    </div>
  );
}
