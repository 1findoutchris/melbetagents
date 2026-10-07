import { siteConfig } from "@/config/site";
import { fmt, getDictionary, type Locale } from "@/i18n";
import type { LegalDoc } from "@/i18n/legal/en";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { IconArrowLeft } from "./Icons";

export function LegalPage({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  const t = getDictionary(locale);
  const { email, telegram } = siteConfig.contact;
  const contact = email
    ? `Contact us at ${email}${telegram ? ` or on Telegram at @${telegram}` : ""}.`
    : telegram
      ? `Contact us on Telegram at @${telegram}.`
      : "Contact details will be published on this page. Until then, you can reply to any message we send you about your application.";
  const values = {
    operator: siteConfig.operator.legalName,
    site: siteConfig.displayName,
    age: siteConfig.responsibleGambling.minimumAge,
    retention: siteConfig.legal.retentionMonths,
    contact,
    relationship: fmt(t.footer.relationship[siteConfig.operator.relationship], {
      operator: siteConfig.operator.legalName,
    }),
  };
  const date = new Date(siteConfig.legal.lastUpdated).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <a className="skip-link" href="#main">
        {t.a11y.skipToContent}
      </a>
      <Header nav={t.nav} a11y={t.a11y} base="/" />
      <main id="main" tabIndex={-1} className="container">
        <article className="legal">
          <a href="/" className="back-link">
            <IconArrowLeft size={18} />
            {t.legal.backHome}
          </a>
          <h1>{doc.title}</h1>
          <p className="legal__meta">
            {t.legal.lastUpdated}: <time dateTime={siteConfig.legal.lastUpdated}>{date}</time>
          </p>
          {/* REVIEW BEFORE LAUNCH: remove this notice once the document has been reviewed. */}
          <p className="legal__review">{t.legal.reviewNotice}</p>
          <p style={{ marginTop: 24 }}>{fmt(doc.intro, values)}</p>
          {doc.sections.map((section) => (
            <section key={section.h}>
              <h2>{section.h}</h2>
              {section.p?.map((para) => (
                <p key={para}>{fmt(para, values)}</p>
              ))}
              {section.ul && (
                <ul>
                  {section.ul.map((item) => (
                    <li key={item}>{fmt(item, values)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
      <Footer t={t.footer} nav={t.nav} a11y={t.a11y} />
    </>
  );
}
