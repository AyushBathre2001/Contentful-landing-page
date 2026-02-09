"use client";

import React, { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link"; // If link is embedded?

export interface AnnouncementData {
  _key: string;
  content: string;
  isClosable: boolean;
  active: boolean;
}

export default function AnnouncementBar({ data }: { data: AnnouncementData }) {
  const [isVisible, setIsVisible] = useState(true);

  if (!data.active || !isVisible) return null;

  return (
    <div className="relative w-full bg-black text-white px-4 md:px-8 py-3 flex items-center justify-center text-xs md:text-sm font-bold tracking-wide z-50">
      {/* Content */}
      <div className="flex items-center gap-2 text-center uppercase">
        <span>{data.content}</span>
        {/* If the design implies a link action, usually it's part of the text or a specific CTA. 
            Assuming basic text for now as per data structure. */}
        <span className="hidden sm:inline-block border-b border-white/50 hover:border-white transition-colors cursor-pointer ml-2">
          {/* Register Now / Learn More placeholder if needed, based on content string usually. */}
        </span>
      </div>

      {/* Close Button */}
      {data.isClosable && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
