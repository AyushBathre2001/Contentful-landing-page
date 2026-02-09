"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/contentful";
import { Entry, EntrySkeletonType, Asset } from "contentful";

// --- Types ---
interface TestimonialFields {
  personcompanyName?: string; // Corrected field name based on data
  role?: string;
  reviewText?: string;
  mainImage?: Asset;
  logoImage?: Asset;
  nameOverlayPosition?: string;
}

interface TestimonialGridFields {
  headingLine1?: string;
  headingLine2?: string;
  testimonials?: Entry<EntrySkeletonType>[];
}

interface TestimonialGridProps {
  data: Entry<EntrySkeletonType>;
}

// --- Main Component ---
export default function TestimonialGrid({ data }: TestimonialGridProps) {
  const fields = data.fields as TestimonialGridFields;
  const { headingLine1, headingLine2, testimonials = [] } = fields;

  const testimonialItems = testimonials || [];

  // Counters to handle the "flip" logic (alternating colors/layouts)
  let fullCount = 0;
  let compactCount = 0;

  return (
    <section className="flex flex-col gap-12 xl:gap-20 bg-[#FFFBF5] rounded-[48px] p-6 sm:p-10 lg:p-16 xl:p-24 my-12">
      {/* Headings */}
      <div className="flex flex-col xl:gap-2 font-bold font-helvetica-neue text-4xl sm:text-5xl lg:text-7xl xl:text-[5.5rem] tracking-tight leading-none text-[#0F0F0F]">
        <div className="text-start">{headingLine1}</div>
        <div className="text-end">{headingLine2}</div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-6 auto-rows-fr">
        {testimonialItems.map((t, idx) => {
          const itemFields = t.fields as TestimonialFields;
          // Logic: Check for reviewText. If text exists, it's a Full Review.
          const text = itemFields.reviewText || "";
          const hasContent = text.trim().length > 0;

          if (hasContent) {
            const flip = fullCount++ % 2 === 1;
            // Full Review takes full width (6 cols), internally grid-cols-4
            return (
              <div key={t.sys.id || idx} className="md:col-span-6 h-full">
                <FullReview item={t} flip={flip} />
              </div>
            );
          } else {
            const flip = compactCount++ % 2 === 1;
            // Compact Review takes half width (3 cols), internally grid-cols-2
            return (
              <div key={t.sys.id || idx} className="md:col-span-3 h-full">
                <CompactReview item={t} flip={flip} />
              </div>
            );
          }
        })}
      </div>
    </section>
  );
}

// --- Sub-Components ---

function FullReview({
  item,
  flip,
}: {
  item: Entry<EntrySkeletonType>;
  flip: boolean;
}) {
  const fields = item.fields as TestimonialFields;
  // Use correct field name "personcompanyName"
  const displayName = fields.personcompanyName || "Name Missing";
  const displayLogo = fields.logoImage;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 h-full min-h-100">
      {/* 
        Layout Flip Logic:
        False (Default/Teal): [Image] [Logo] [Review (2 cols)] matches Row 1
        True (Pink): [Review (2 cols)] [Logo] [Image] matches Row 2
      */}
      {flip ? (
        <>
          <ReviewTile item={item} flip={flip} displayName={displayName} />
          {/* On mobile, stack order might need adjustment, currently stacks vertically */}
          <div className="col-span-1 hidden md:block">
            <LogoTile asset={displayLogo} name={displayName} />
          </div>
          {/* Mobile view logic handling simplified for now to generic grid flow */}
          <div className="col-span-1 md:hidden">
            <LogoTile asset={displayLogo} name={displayName} />
          </div>
          <ImageTile
            asset={fields.mainImage}
            name={displayName}
            pos={fields.nameOverlayPosition}
          />
        </>
      ) : (
        <>
          <ImageTile
            asset={fields.mainImage}
            name={displayName}
            pos={fields.nameOverlayPosition}
          />
          <LogoTile asset={displayLogo} name={displayName} />
          <ReviewTile item={item} flip={flip} displayName={displayName} />
        </>
      )}
    </div>
  );
}

function CompactReview({
  item,
  flip,
}: {
  item: Entry<EntrySkeletonType>;
  flip: boolean;
}) {
  const fields = item.fields as TestimonialFields;
  const displayName = fields.personcompanyName || "";
  const displayLogo = fields.logoImage;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full min-h-100 sm:min-h-75">
      {/* 
         Layout Flip Logic:
         False: [Logo] [Image] matches Row 3 Left
         True: [Image] [Logo] matches Row 3 Right
      */}
      {flip ? (
        <>
          <ImageTile
            asset={fields.mainImage}
            name={displayName}
            pos={fields.nameOverlayPosition}
          />
          <LogoTile asset={displayLogo} name={displayName} />
        </>
      ) : (
        <>
          <LogoTile asset={displayLogo} name={displayName} />
          <ImageTile
            asset={fields.mainImage}
            name={displayName}
            pos={fields.nameOverlayPosition}
          />
        </>
      )}
    </div>
  );
}

function ImageTile({
  asset,
  name,
  pos = "bottom-left",
}: {
  asset: Asset | undefined;
  name: string;
  pos?: string;
}) {
  const imageUrl = getImageUrl(asset);

  // Parse position class
  let posClass = "bottom-3 left-3";
  if (pos === "top-left") posClass = "top-3 left-3";
  if (pos === "top-right") posClass = "top-3 right-3";
  if (pos === "bottom-right") posClass = "bottom-3 right-3";

  return (
    <div className="relative w-full h-full min-h-70 overflow-hidden border border-black bg-gray-100 group">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      {/* Dark Gradient Overlay for text legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />

      {/* Name Overlay */}
      {name && (
        <span
          className={cn(
            "absolute text-white font-bold text-lg tracking-wide z-10 drop-shadow-md",
            posClass,
          )}
        >
          {name}
        </span>
      )}

      {/* Plus Button (Bottom Right) */}
      <div className="absolute bottom-3 right-3 bg-black text-white rounded-full p-1.5 z-20 transition-transform group-hover:rotate-90">
        <Plus className="w-5 h-5" />
      </div>
    </div>
  );
}

function LogoTile({ asset, name }: { asset: Asset | undefined; name: string }) {
  const logoUrl = getImageUrl(asset);

  return (
    <div className="relative w-full h-full min-h-50 flex items-center justify-center border border-black bg-[#FFFBF5] p-8 group overflow-hidden">
      {logoUrl ? (
        <div className="relative w-full h-full max-w-[80%] max-h-[80%]">
          <Image src={logoUrl} alt={name} fill className="object-contain" />
        </div>
      ) : (
        <div className="text-center font-serif text-2xl text-[#0F0F0F] px-4">
          {name}
        </div>
      )}
      {/* Removed Plus button from Logo Tile as per design analysis */}
    </div>
  );
}

function ReviewTile({
  item,
  flip,
  displayName,
}: {
  item: Entry<EntrySkeletonType>;
  flip: boolean;
  displayName: string;
}) {
  const fields = item.fields as TestimonialFields;
  const text = fields.reviewText;

  // Colors based on Flip: False = Teal (#72EFDD), True = Pink (#F582FF)
  // Design Teal: Bright Turquoise. Design Pink: Bright Magenta.
  const bgColor = flip ? "bg-[#FF7AF5]" : "bg-[#7FFFD4]";

  return (
    <div
      className={cn(
        "col-span-1 sm:col-span-2 flex flex-col justify-between border border-black p-6 md:p-8 min-h-80 relative group transition-colors hover:brightness-95",
        bgColor,
      )}
    >
      <div className="mb-8 text-[#0F0F0F] text-lg sm:text-xl font-medium leading-relaxed tracking-tight">
        {text}
      </div>

      <div className="flex justify-between items-end mt-auto w-full relative z-10">
        <div className="w-full pr-12">
          {/* Border line */}
          <div className="border-t border-black w-full mb-3 opacity-30"></div>

          <div className="text-[#0F0F0F] text-lg font-bold leading-tight">
            {displayName}
          </div>
          {fields.role && (
            <div className="text-[#0F0F0F] text-sm font-medium opacity-70 mt-1">
              {fields.role}
            </div>
          )}
        </div>

        {/* Plus Button (Bottom Right) */}
        <div className="absolute bottom-0 right-0 bg-black text-white rounded-full p-1.5 transition-transform group-hover:rotate-90">
          <Plus className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
