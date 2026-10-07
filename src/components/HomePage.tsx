import { siteConfig } from "@/config/site";
import { fmt, getDictionary, type Locale } from "@/i18n";
import { JsonLd, siteJsonLd } from "@/lib/seo";
import { About } from "./About";
import { AgentTypes } from "./AgentTypes";
import { ApplicationSection } from "./ApplicationSection";
import { Band } from "./Band";
import { Benefits } from "./Benefits";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { LogoStrip } from "./LogoStrip";
import { Reveal } from "./Reveal";
import { SportsShowcase } from "./SportsShowcase";
import { StickyApply } from "./StickyApply";

/** Full landing page for one locale. Add `src/app/<locale>/page.tsx` rendering this to add a language. */
export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const age = siteConfig.responsibleGambling.minimumAge;
  // Mirrors the visible FAQ exactly.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: fmt(item.a, { age }) },
    })),
  };
  return (
    <>
      <a className="skip-link" href="#main">
        {t.a11y.skipToContent}
      </a>
      <Header nav={t.nav} a11y={t.a11y} />
      <main id="main" tabIndex={-1}>
        <Hero t={t.hero} />
        <Band variant="to-alt" />
        <About t={t.about} />
        <Benefits t={t.benefits} />
        <AgentTypes t={t.agentTypes} />
        <SportsShowcase t={t.sports} partners={t.partners} />
        <HowItWorks t={t.howItWorks} />
        <ApplicationSection t={t} locale={locale} />
        <Faq t={t.faq} age={siteConfig.responsibleGambling.minimumAge} />
        <Band variant="from-alt" />
        <LogoStrip t={t.partners} />
        <FinalCta t={t.finalCta} />
      </main>
      <Footer t={t.footer} nav={t.nav} a11y={t.a11y} />
      <StickyApply label={t.stickyCta} />
      <Reveal />
      <JsonLd data={siteJsonLd(locale)} />
      <JsonLd data={faqJsonLd} />
    </>
  );
}
