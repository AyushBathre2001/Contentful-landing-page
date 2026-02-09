import { createClient, Asset, Entry, EntrySkeletonType } from "contentful";

// Validate environment variables
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const client = createClient({
  space: "c0qpct7232jw",
  accessToken: "JC9FL0YcDs1Gyno2ykMTQ4Yg20aPYff9p4EDYiZ6gJY",
});

// =============================================================================
// IMAGE HELPER
// =============================================================================

export function getImageUrl(asset: Asset | undefined | null): string {
  if (!asset?.fields?.file?.url) return "";
  const url = asset.fields.file.url as string;
  return url.startsWith("//") ? `https:${url}` : url;
}

// Helper to extract plain text from Contentful Rich Text
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRichTextPlain(richText: any): string {
  if (!richText?.content) return "";

  const extractText = (node: any): string => {
    if (node.nodeType === "text") return node.value || "";
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join("");
    }
    return "";
  };

  return extractText(richText);
}

// =============================================================================
// TYPES - Based on Contentful Schema
// =============================================================================

// --- Primitive/Shared Types ---
export interface ContentfulImage {
  fields: {
    file: {
      url: string;
      details?: {
        image?: { width: number; height: number };
      };
    };
    title?: string;
    description?: string;
  };
}

export interface CustomLink {
  fields: {
    label: string;
    url: string;
    openInNewTab?: boolean;
  };
}

export interface Button {
  fields: {
    text: string;
    url: string;
    variant?: string;
  };
}

// --- Header Types ---
export interface AnnouncementBar {
  fields: {
    text: string;
    link?: Entry<EntrySkeletonType>;
    active: boolean;
  };
}

export interface NavDropdown {
  fields: {
    title: string;
    links: Entry<EntrySkeletonType>[];
  };
}

export interface HeaderData {
  fields: {
    logo: Asset;
    announcementBar?: Entry<EntrySkeletonType>[];
    navItems?: Entry<EntrySkeletonType>[];
    ctaButton?: Entry<EntrySkeletonType>;
  };
}

// --- Footer Types ---
export interface SocialLink {
  fields: {
    platform: string;
    url: string;
  };
}

export interface FooterLinkColumn {
  fields: {
    title: string;
    links: Entry<EntrySkeletonType>[];
  };
}

export interface FooterData {
  fields: {
    logo?: Asset;
    tagline?: string;
    linkColumns?: Entry<EntrySkeletonType>[];
    socialLinks?: Entry<EntrySkeletonType>[];
    copyrightText?: string;
  };
}

// --- Section Types ---
export interface HeroSection {
  fields: {
    heading: string;
    description?: string;
    backgroundImage?: Asset;
    buttons?: Entry<EntrySkeletonType>[];
  };
}

export interface HighlightSection {
  fields: {
    heading?: string;
    description?: string;
    illustration?: Asset;
    buttons?: Entry<EntrySkeletonType>[];
  };
}

export interface FeatureSection {
  fields: {
    heading?: string;
    tagline?: string;
    image?: Asset;
    featureCarousel?: Entry<EntrySkeletonType>;
  };
}

export interface CarouselItem {
  fields: {
    title: string;
    description?: string;
    image?: Asset;
  };
}

export interface FeatureCarousel {
  fields: {
    items: Entry<EntrySkeletonType>[];
  };
}

export interface ShowcaseTab {
  fields: {
    tabHeading: string;
    tabDescription?: string;
    tabImage?: Asset;
  };
}

export interface TabbedShowcase {
  fields: {
    sectionTitle?: string;
    badgeLabel?: string;
    layoutVariant?: string;
    tabs: Entry<EntrySkeletonType>[];
  };
}

export interface FaqItem {
  fields: {
    question: string;
    answer: string;
  };
}

export interface FaqSection {
  fields: {
    heading?: string;
    description?: string;
    backgroundImage?: Asset;
    faqs: Entry<EntrySkeletonType>[];
  };
}

export interface Sponsor {
  fields: {
    sponsorName: string;
    logo: Asset;
  };
}

export interface SponsorsSection {
  fields: {
    internalTitle?: string;
    sponsorsList: Entry<EntrySkeletonType>[];
  };
}

export interface BentoCard {
  fields: {
    personCompanyName?: string;
    role?: string;
    reviewText?: string;
    mainImage?: Asset;
    logoImage?: Asset;
    nameOverlayPosition?: string;
  };
}

export interface TestimonialGrid {
  fields: {
    headingLine1?: string;
    headingLine2?: string;
    testimonials: Entry<EntrySkeletonType>[];
  };
}

export interface LeaderboardCompetitor {
  fields: {
    companyName: string;
    score: string;
    watercolorBarImage?: Asset;
  };
}

export interface CompetitionLeaderboard {
  fields: {
    heading?: string;
    description?: string;
    reportButton?: Entry<EntrySkeletonType>;
    chartTitle?: string;
    cardBackgroundImage?: Asset;
    competitorsList: Entry<EntrySkeletonType>[];
  };
}

export interface PromoBanner {
  fields: {
    mainTitleLeft?: string;
    descriptionLeft?: string;
    buttons?: Entry<EntrySkeletonType>[];
    rightTextLine1?: string;
    rightTextLine2?: string;
    rightTextLine3?: string;
  };
}

// --- Landing Page ---
export interface LandingPage {
  fields: {
    pageTitle: string;
    pageSections: Entry<EntrySkeletonType>[];
  };
}

// =============================================================================
// FETCH FUNCTIONS
// =============================================================================

export async function getHeader(): Promise<Entry<EntrySkeletonType> | null> {
  try {
    const response = await client.getEntries({
      content_type: "header",
      include: 3,
      limit: 1,
    });
    return response.items[0] || null;
  } catch (error) {
    console.error("Error fetching header:", error);
    return null;
  }
}

export async function getLandingPage(): Promise<Entry<EntrySkeletonType> | null> {
  try {
    const response = await client.getEntries({
      content_type: "landingPage",
      include: 4,
      limit: 1,
    });
    return response.items[0] || null;
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return null;
  }
}

export async function getFooter(): Promise<Entry<EntrySkeletonType> | null> {
  try {
    const response = await client.getEntries({
      content_type: "globalFooter",
      include: 10,
      limit: 1,
    });
    return response.items[0] || null;
  } catch (error) {
    console.error("Error fetching footer:", error);
    return null;
  }
}

// Helper to get link details from a CustomLink entry
export const getContentfulLinkDetails = (
  link: Entry<EntrySkeletonType> | undefined,
) => {
  if (!link?.fields) return { href: "#", label: "", isExternal: false };

  const fields = link.fields as CustomLink["fields"];
  return {
    href: fields.url || "#",
    label: fields.label || "",
    isExternal: fields.openInNewTab || false,
  };
};

// Helper to get button details from a Button entry
export const getButtonDetails = (
  button: Entry<EntrySkeletonType> | undefined,
) => {
  if (!button?.fields) return { text: "", url: "#", variant: "default" };

  const fields = button.fields as Button["fields"];
  return {
    text: fields.text || "",
    url: fields.url || "#",
    variant: fields.variant || "default",
  };
};

// Helper to get section type (replaces Sanity's _type)
export const getSectionType = (section: Entry<EntrySkeletonType>): string => {
  return section.sys.contentType?.sys?.id || "";
};

export default client;
