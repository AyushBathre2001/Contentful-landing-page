"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

import { getImageUrl, getContentfulLinkDetails } from "@/lib/contentful";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import AnnouncementBar from "./announcement-bar";
import { Entry, EntrySkeletonType, Asset } from "contentful";
import { cn } from "@/lib/utils";

// Types
interface HeaderEntry {
  fields: {
    logo?: Asset;
    announcementBar?: Entry<EntrySkeletonType>[];
    leftNav?: Entry<EntrySkeletonType>[];
    rightNav?: Entry<EntrySkeletonType>[];
    ctaButton?: Entry<EntrySkeletonType>;
  };
}

interface NavItemFields {
  label?: string;
  url?: string;
  openInNewTab?: boolean;
  title?: string;
  links?: Entry<EntrySkeletonType>[];
}

function isDropdown(item: Entry<EntrySkeletonType>): boolean {
  const fields = item.fields as NavItemFields;
  return Array.isArray(fields.links);
}

export default function Header({
  data,
}: {
  data: Entry<EntrySkeletonType> | null;
}) {
  const headerFields = (data?.fields || {}) as HeaderEntry["fields"];

  const activeAnnouncements = (headerFields.announcementBar || []).filter(
    (a) => {
      const fields = a.fields as { active?: boolean };
      return fields.active;
    },
  );

  if (!data?.fields) return null;

  const logoSrc = getImageUrl(headerFields.logo);
  const logoAlt = (headerFields.logo?.fields?.title as string) || "Logo";
  const leftNavItems = headerFields.leftNav || [];
  const rightNavItems = headerFields.rightNav || [];

  return (
    <>
      {/* 1. Static Announcement Bar (Scrolls away with page) */}
      <div className="relative z-50 w-full bg-black text-white pointer-events-auto">
        {activeAnnouncements.map((announcement, idx) => {
          const fields = announcement.fields as {
            text?: string;
            active?: boolean;
          };
          return (
            <AnnouncementBar
              data={{
                _key: announcement.sys.id,
                content: fields.text || "",
                isClosable: false,
                active: fields.active || false,
              }}
              key={announcement.sys.id || idx}
            />
          );
        })}
      </div>

      {/* 2. Sticky Header Overlay */}
      {/* 
         - sticky top-0: Sticks to top of viewport when scrolling
         - h-0: Takes up no vertical space so Hero starts immediately appropriately
         - z-40: Below AnnouncementBar (z-50) but above Hero (z-10)
      */}
      <header className="sticky top-0 z-40 w-full h-0 pointer-events-none">
        <div className="absolute top-0 w-full">
          <div className="mx-auto flex items-center justify-between gap-3 px-6 py-6 md:py-6 bg-transparent max-w-[1440px]">
            <NavigationMenu className="hidden w-full flex-1 lg:flex justify-between items-start gap-4 max-w-none bg-transparent!">
              {/* LEFT FLOATING CARD */}
              <NavigationMenuList className="gap-6 px-6 h-[72px] bg-white rounded-xl shadow-lg pointer-events-auto items-center">
                <NavigationMenuItem className="pointer-events-auto mr-4">
                  <NavigationMenuLink asChild>
                    <Link href="/" className="flex items-center">
                      {logoSrc && (
                        <Image
                          src={logoSrc}
                          alt={logoAlt}
                          width={140}
                          height={44}
                          className="h-8 w-auto md:h-10 object-contain"
                          priority
                        />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavItems items={leftNavItems} />
              </NavigationMenuList>

              {/* RIGHT FLOATING CARD */}
              <NavigationMenuList className="gap-8 px-6 h-[72px] bg-white rounded-xl shadow-lg pointer-events-auto items-center">
                <NavItems items={rightNavItems} />

                {headerFields.ctaButton && (
                  <NavigationMenuItem className="pointer-events-auto">
                    <NavigationMenuLink asChild>
                      <Button
                        asChild
                        className="bg-[#2D0F05] text-white hover:bg-black font-bold text-base px-6 py-2.5 h-auto rounded-lg"
                      >
                        <Link
                          href={
                            (headerFields.ctaButton.fields as { url?: string })
                              .url || "#"
                          }
                        >
                          {(headerFields.ctaButton.fields as { text?: string })
                            .text || "Get Started"}
                        </Link>
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile menu */}
            <div className="lg:hidden pointer-events-auto bg-white rounded-full p-2 shadow-lg">
              <MobileMenu data={data} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

const NavItems = ({ items }: { items: Entry<EntrySkeletonType>[] }) => {
  return (
    <>
      {items.map((item, idx) => {
        const fields = item.fields as NavItemFields;

        if (!isDropdown(item)) {
          const { href, label, isExternal } = getContentfulLinkDetails(item);
          return (
            <NavigationMenuItem
              key={item.sys.id || idx}
              className="pointer-events-auto"
            >
              <NavigationMenuLink
                href={href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={cn(
                  "font-bold text-base text-[#0F0F0F] hover:text-gray-600 transition-colors",
                  "bg-transparent hover:bg-transparent focus:bg-transparent",
                )}
              >
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        } else {
          return (
            <NavigationMenuItem
              key={item.sys.id || idx}
              className="pointer-events-auto"
            >
              <NavigationMenuTrigger
                className={cn(
                  "font-bold text-base gap-1 [&>svg]:size-4 text-[#0F0F0F] hover:text-gray-600",
                  "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
                )}
              >
                {fields.title || fields.label || "Menu"}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="pointer-events-auto bg-white border border-gray-100 shadow-xl rounded-xl mt-2">
                <ul className="grid w-64 gap-2 p-4">
                  {fields.links &&
                    fields.links.map((subItem, subIdx) => {
                      const subLink = getContentfulLinkDetails(subItem);
                      return (
                        <li key={subItem.sys.id || subIdx}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={subLink.href}
                              className="block select-none space-y-1 rounded-md p-3 hover:bg-gray-50 transition-colors"
                              target={subLink.isExternal ? "_blank" : undefined}
                            >
                              <div className="text-sm font-semibold leading-none text-[#0F0F0F]">
                                {subLink.label}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        }
      })}
    </>
  );
};

function MobileMenu({ data }: { data: Entry<EntrySkeletonType> }) {
  const headerFields = data.fields as {
    logo?: Asset;
    navItems?: Entry<EntrySkeletonType>[];
    ctaButton?: Entry<EntrySkeletonType>;
  };

  const logoSrc = getImageUrl(headerFields.logo);
  const logoAlt = (headerFields.logo?.fields?.title as string) || "Logo";

  return (
    <Sheet>
      <SheetTrigger className="pointer-events-auto" asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-transparent"
        >
          <Menu className="h-6 w-6 text-black" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] bg-white text-black p-6">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="mt-4 space-y-8">
          <Link href="/" className="flex items-center">
            {logoSrc && (
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            )}
          </Link>
          <div className="text-sm text-gray-500">
            Menu items available on desktop
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
