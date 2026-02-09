import {
  getHeader,
  getLandingPage,
  getFooter,
  getSectionType,
} from "@/lib/contentful";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabbedShowcase from "@/components/TabbedShowcase";
import TestimonialGrid from "@/components/TestimonialGrid";
import FaqSection from "@/components/FaqSection";
import HighlightSection from "@/components/HighlightSection";
import SponsorsSection from "@/components/SponsorsSection";
import TitleBlocksSection from "@/components/TitleBlocksSection";
import CompetitionLeaderboard from "@/components/CompetitionLeaderboard";
import PromoBanner from "@/components/PromoBanner";
import LoadingPage from "@/components/LoadingPage";
import { Entry, EntrySkeletonType } from "contentful";

export const revalidate = 0;

export default async function Home() {
  try {
    // Fetch all data in parallel from Contentful
    const [headerEntry, pageEntry, footerEntry] = await Promise.all([
      getHeader(),
      getLandingPage(),
      getFooter(),
    ]);

    const headerData = headerEntry?.fields;
    const footerData = footerEntry?.fields;

    const sections =
      (pageEntry?.fields?.pageSections as Entry<EntrySkeletonType>[]) || [];

    // If critical data is missing, show loading page
    if (!headerEntry || !pageEntry) {
      return <LoadingPage />;
    }

    return (
      <>
        {/* Header */}
        {headerData && <Header data={headerEntry} />}

        <main className="min-h-screen bg-slate-50">
          {sections.map((section: Entry<EntrySkeletonType>, index: number) => {
            const sectionType = getSectionType(section);

            if (sectionType === "heroSection") {
              return <Hero key={section.sys.id || index} data={section} />;
            }

            if (sectionType === "featureSection") {
              return (
                <FeatureSection key={section.sys.id || index} data={section} />
              );
            }
            if (sectionType === "tabbedShowcase") {
              return (
                <TabbedShowcase key={section.sys.id || index} data={section} />
              );
            }
            if (sectionType === "testimonialGrid") {
              return (
                <TestimonialGrid key={section.sys.id || index} data={section} />
              );
            }
            if (sectionType === "faqSection") {
              return (
                <FaqSection key={section.sys.id || index} data={section} />
              );
            }
            if (sectionType === "highlightSection") {
              return (
                <HighlightSection
                  key={section.sys.id || index}
                  data={section}
                />
              );
            }
            if (sectionType === "sponsorsSection") {
              return (
                <SponsorsSection key={section.sys.id || index} data={section} />
              );
            }
            if (sectionType === "titleBlocksSection") {
              return (
                <TitleBlocksSection
                  key={section.sys.id || index}
                  data={section}
                />
              );
            }
            if (sectionType === "competitionLeaderboard") {
              return (
                <CompetitionLeaderboard
                  key={section.sys.id || index}
                  data={section}
                />
              );
            }
            if (sectionType === "promoBanner") {
              return (
                <PromoBanner key={section.sys.id || index} data={section} />
              );
            }
            return null;
          })}
        </main>

        {/* Footer */}
        {footerData && <Footer data={footerEntry} />}
      </>
    );
  } catch (error) {
    console.error("Error loading page data:", error);
    return <LoadingPage />;
  }
}
