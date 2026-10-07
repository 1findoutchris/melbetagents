import { siteConfig } from "@/config/site";
import { getDictionary, type Locale } from "@/i18n";
import { AgentTypes } from "./AgentTypes";
import { ApplicationSection } from "./ApplicationSection";
import { Benefits } from "./Benefits";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Reveal } from "./Reveal";
import { StickyApply } from "./StickyApply";

/** Full landing page for one locale. Add `src/app/<locale>/page.tsx` rendering this to add a language. */
export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <a className="skip-link" href="#main">
        {t.a11y.skipToContent}
      </a>
      <Header nav={t.nav} a11y={t.a11y} />
      <main id="main" tabIndex={-1}>
        <Hero t={t.hero} dashboard={t.dashboard} />
        <Benefits t={t.benefits} />
        <AgentTypes t={t.agentTypes} applyLabel={t.hero.primaryCta} />
        <HowItWorks t={t.howItWorks} />
        <ApplicationSection t={t} locale={locale} />
        <Faq t={t.faq} age={siteConfig.responsibleGambling.minimumAge} />
        <FinalCta t={t.finalCta} />
      </main>
      <Footer t={t.footer} nav={t.nav} a11y={t.a11y} />
      <StickyApply label={t.stickyCta} />
      <Reveal />
    </>
  );
}
