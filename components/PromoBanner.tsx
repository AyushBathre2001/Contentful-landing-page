"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getButtonDetails } from "@/lib/contentful";
import { Entry, EntrySkeletonType } from "contentful";

interface PromoBannerFields {
  mainTitleLeft?: string;
  descriptionLeft?: string;
  rightTextLine1?: string;
  rightTextLine2?: string;
  rightTextLine3?: string;
  buttons?: Entry<EntrySkeletonType>[];
}

interface PromoBannerProps {
  data: Entry<EntrySkeletonType>;
}

export default function PromoBanner({ data }: PromoBannerProps) {
  const fields = data.fields as PromoBannerFields;
  const {
    mainTitleLeft,
    descriptionLeft,
    rightTextLine1,
    rightTextLine2,
    rightTextLine3,
    buttons,
  } = fields;

  const buttonItems = buttons || [];

  return (
    <section className="flex w-full justify-center items-center relative p-6 py-16 2xl:py-34 2xl:pb-44 bg-[#1E0903]">
      <div className="relative w-full max-w-7xl">
        {/* 1. Main Content Card (Foreground) */}
        <div className="flex flex-col sm:flex-row rounded-md pl-6 pr-3 py-6 bg-white divide-y lg:divide-y-0 lg:divide-x-3 divide-dotted divide-black relative z-10">
          {/* Left Side: Title & Description */}
          <div className="flex sm:w-1/2 lg:w-2/3 flex-col justify-between gap-12 lg:px-6 py-6 sm:py-0">
            {mainTitleLeft && (
              <h2 className="font-helvetica-neue text-3xl md:text-4xl font-light text-black lg:max-w-2/3">
                {mainTitleLeft}
              </h2>
            )}
            {descriptionLeft && (
              <p className="font-helvetica-neue font-normal text-base md:text-xl lg:max-w-2/3 tracking-tight text-gray-800">
                {descriptionLeft}
              </p>
            )}
          </div>

          {/* Right Side: Stats & Buttons */}
          <div className="sm:w-1/2 lg:w-1/3 pt-6 sm:pt-0 flex flex-col justify-end items-end gap-4">
            {/* Stacked Text Lines */}
            <div className="flex flex-col items-end text-black">
              {rightTextLine1 && (
                <span className="self-start font-helvetica-neue font-normal text-sm 2xl:text-base">
                  {rightTextLine1}
                </span>
              )}
              {rightTextLine2 && (
                <span className="self-center font-helvetica-neue font-normal text-6xl md:text-8xl lg:text-9xl leading-none">
                  {rightTextLine2}
                </span>
              )}
              {rightTextLine3 && (
                <span className="self-end font-helvetica-neue font-normal text-sm 2xl:text-base">
                  {rightTextLine3}
                </span>
              )}
            </div>

            {/* Buttons */}
            {buttonItems.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {buttonItems.map((btn, idx) => {
                  const { text, url, variant } = getButtonDetails(btn);
                  const isSecondary = variant === "secondary";
                  return (
                    <Button
                      key={btn.sys.id || idx}
                      variant={isSecondary ? "secondary" : "default"}
                      asChild
                    >
                      <Link href={url || "#"}>{text}</Link>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 2. Decorative Gradient Shadow (Background) */}
        <div
          className="absolute -translate-x-3 translate-y-3 inset-0 rounded-md shadow-lg z-0"
          style={{
            background: `linear-gradient(to right,#E7DFD4 0%,#E9BFC9 14%,#FF59AE 26%,#FD368A 33%,#F45669 44%,#EC7551 51%,#49AA3F 67%,#1C997C 78%,#B1DFAB 96%,#E7DFD4 100%)`,
          }}
        />
      </div>
    </section>
  );
}
