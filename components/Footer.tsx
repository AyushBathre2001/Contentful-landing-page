"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getImageUrl,
  getContentfulLinkDetails,
  getRichTextPlain,
} from "@/lib/contentful";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Entry, EntrySkeletonType, Asset } from "contentful";

// Types for Contentful Footer data (matching actual Contentful field names)
interface FooterFields {
  footerLogo?: Asset;
  navigationColumns?: Entry<EntrySkeletonType>[];
  newsletterHeading?: unknown; // Rich Text
  newsletterDescription?: unknown; // Rich Text
  emailPlaceholder?: string;
  newsletterButtonLabel?: string;
  copyrightText?: unknown; // Rich Text
  legalLinks?: Entry<EntrySkeletonType>[];
  cookieSettingsLabel?: string;
  socialMediaLinks?: Entry<EntrySkeletonType>[];
}

interface FooterColumnFields {
  title?: string;
  links?: Entry<EntrySkeletonType>[];
}

interface SocialLinkFields {
  platform?: string;
  url?: string;
}

export default function Footer({
  data,
}: {
  data: Entry<EntrySkeletonType> | null;
}) {
  if (!data?.fields) return null;

  const fields = data.fields as FooterFields;
  const {
    footerLogo,
    navigationColumns,
    newsletterHeading,
    newsletterDescription,
    emailPlaceholder,
    newsletterButtonLabel,
    copyrightText,
    legalLinks,
    socialMediaLinks,
  } = fields;

  return (
    <footer className="bg-neutral-100 px-4 py-8">
      <div className="mx-auto space-y-2">
        {/* Top Dark Section */}
        <div className="rounded-3xl bg-[#0F1415] px-8 py-12 md:px-12 md:py-16">
          <div className="flex flex-col xl:flex-row gap-8 md:gap-16 xl:gap-12">
            <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-20">
              {/* Logo */}
              <div className="min-w-50 lg:min-w-0 2xl:min-w-3xs shrink-0">
                <Link href="/" className="flex items-center">
                  {footerLogo && (
                    <Image
                      src={getImageUrl(footerLogo)}
                      alt={(footerLogo.fields?.title as string) || "Logo"}
                      width={140}
                      height={44}
                      className="h-10 2xl:h-14 w-auto brightness-0 invert"
                    />
                  )}
                </Link>
              </div>

              {/* Navigation Columns */}
              <ul className="w-full flex flex-wrap lg:flex-nowrap gap-8 lg:gap-20">
                {navigationColumns?.map((group, idx) => {
                  const columnFields = group.fields as FooterColumnFields;
                  if (!columnFields) return null;

                  return (
                    <li
                      key={group.sys.id || idx}
                      className="flex-1 min-w-50 lg:min-w-0 min-[1700px]:min-w-3xs"
                    >
                      <h3 className="mb-4 text-lg font-semibold text-[#F9FBFB]">
                        {columnFields.title}
                      </h3>
                      <ul className="space-y-3">
                        {columnFields.links?.map((link, linkIdx) => {
                          const { href, isExternal, label } =
                            getContentfulLinkDetails(link);
                          return (
                            <li key={link.sys.id || linkIdx}>
                              {isExternal ? (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#838383] transition-colors hover:text-[#F9FBFB]"
                                >
                                  {label}
                                </a>
                              ) : (
                                <Link
                                  href={href}
                                  className="text-[#838383] transition-colors hover:text-[#F9FBFB]"
                                >
                                  {label}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="flex flex-col gap-4 md:max-w-sm md:self-end ml-auto xl:self-start xl:max-w-100 ">
              <div className="text-lg font-semibold text-white">
                {getRichTextPlain(newsletterHeading) ||
                  "Subscribe to our newsletter"}
              </div>
              <div className="text-sm text-neutral-400 leading-relaxed lg:text-base">
                {getRichTextPlain(newsletterDescription) ||
                  "Stay updated with the latest news."}
              </div>

              <NewsletterSubscriptionForm
                buttonLabel={newsletterButtonLabel || "Subscribe"}
                placeholder={emailPlaceholder || "joe@123.com"}
              />
            </div>
          </div>
        </div>

        {/* Bottom Light Section */}
        <div className="px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            {/* {copyrightText && (
              <div className="text-sm text-neutral-500">
                {getRichTextPlain(copyrightText)}
              </div>
            )} */}

            {/* Legal Links */}
            {legalLinks && legalLinks.length > 0 && (
              <div className="flex gap-4">
                {legalLinks.map((link, idx) => {
                  const { href, isExternal, label } =
                    getContentfulLinkDetails(link);
                  return isExternal ? (
                    <a
                      key={link.sys.id || idx}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-500 hover:text-neutral-700"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      key={link.sys.id || idx}
                      href={href}
                      className="text-sm text-neutral-500 hover:text-neutral-700"
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {socialMediaLinks?.map((item, idx) => {
              const socialFields = item.fields as SocialLinkFields;
              if (!socialFields) return null;

              return (
                <Link
                  key={item.sys.id || idx}
                  href={socialFields.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-700 transition-colors"
                  aria-label={socialFields.platform}
                >
                  <SocialIcon icon={socialFields.platform || ""} />
                  <span className="sr-only">{socialFields.platform}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Sub-components ---

const NewsletterSubscriptionForm = ({
  buttonLabel,
  placeholder,
}: {
  buttonLabel: string;
  placeholder: string;
}) => {
  const schema = z.object({
    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(1, { message: "Email is required" }),
  });

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: { email: "" },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log("Newsletter submitted:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col flex-1 relative">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className="h-full rounded-r-none bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:border-orange-500 focus:ring-orange-500"
                />
              </FormControl>
              <FormMessage className="absolute -bottom-6 left-0" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="text-sm font-normal rounded-l-none bg-orange-500 hover:bg-orange-600 text-white px-6"
        >
          {buttonLabel}
        </Button>
      </form>
    </Form>
  );
};

const SocialIcon = ({ icon }: { icon: string }) => {
  const iconLower = icon.toLowerCase();
  switch (iconLower) {
    case "facebook":
      return <FaFacebook className="h-6 w-6" />;
    case "x":
    case "twitter":
      return <BsTwitterX className="h-6 w-6" />;
    case "instagram":
      return <FaInstagram className="h-6 w-6" />;
    case "linkedin":
      return <FaLinkedin className="h-6 w-6" />;
    case "youtube":
      return <FaYoutube className="h-6 w-6" />;
    default:
      return null;
  }
};
