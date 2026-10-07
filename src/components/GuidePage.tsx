import { siteConfig, siteUrl } from "@/config/site";
import { fmt, getDictionary, type Locale } from "@/i18n";
import type { CompareGuide } from "@/i18n/guides/en";
import { JsonLd } from "@/lib/seo";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { IconArrowLeft, IconArrowRight, IconCheck, IconAlert } from "./Icons";

export function GuidePage({ g, locale }: { g: CompareGuide; locale: Locale }) {
  const t = getDictionary(locale);
  const url = `${siteUrl()}${g.path}`;
  const date = new Date(g.updated).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: g.title,
        description: g.description,
        dateModified: g.updated,
        datePublished: g.updated,
        inLanguage: locale,
        mainEntityOfPage: url,
        isPartOf: { "@id": `${siteUrl()}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: g.breadcrumbHome, item: `${siteUrl()}/` },
          { "@type": "ListItem", position: 2, name: g.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <a className="skip-link" href="#main">
        {t.a11y.skipToContent}
      </a>
      <Header nav={t.nav} a11y={t.a11y} base="/" />
      <main id="main" tabIndex={-1} className="container">
        <article className="legal guide">
          <nav aria-label="Breadcrumb">
            <a href="/" className="back-link">
              <IconArrowLeft size={18} />
              {g.breadcrumbHome}
            </a>
          </nav>
          <p className="eyebrow">{g.eyebrow}</p>
          <h1>{g.title}</h1>
          <p className="legal__meta">
            {t.legal.lastUpdated}: <time dateTime={g.updated}>{date}</time>
          </p>
          {g.intro.map((para) => (
            <p key={para} className="guide__intro">
              {para}
            </p>
          ))}

          <section>
            <h2>{g.roles.heading}</h2>
            <p>{g.roles.lead}</p>
            <div className="compare" role="region" aria-label={g.roles.heading} tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    {g.roles.columns.map((c, i) => (
                      <th key={i} scope="col">
                        {c || <span className="sr-only">{g.roles.heading}</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {g.roles.rows.map(([label, agent, affiliate]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td data-label={g.roles.columns[1]}>{agent}</td>
                      <td data-label={g.roles.columns[2]}>{affiliate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>{g.roles.note}</p>
          </section>

          <section>
            <h2>{g.compare.heading}</h2>
            <p>{g.compare.lead}</p>
            <div className="guide__grid">
              {g.compare.items.map((item) => (
                <div key={item.title} className="guide__card">
                  <h3>{item.title}</h3>
                  <ul className="guide__list">
                    {item.points.map((point) => (
                      <li key={point}>
                        <IconCheck size={16} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>{g.warnings.heading}</h2>
            <ul className="guide__list guide__list--warn">
              {g.warnings.points.map((point) => (
                <li key={point}>
                  <IconAlert size={16} />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{g.checklist.heading}</h2>
            <ol className="guide__ol">
              {g.checklist.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ol>
          </section>

          <section className="guide__apply">
            <h2>{g.apply.heading}</h2>
            <p>{g.apply.body}</p>
            <a href="/#apply" className="btn btn--primary btn--lg">
              {g.apply.cta}
              <IconArrowRight size={20} className="arrow" />
            </a>
          </section>

          <p className="guide__fine">
            {g.trademarks}{" "}
            {fmt(t.footer.relationship[siteConfig.operator.relationship], { operator: siteConfig.operator.legalName })}
          </p>
        </article>
      </main>
      <Footer t={t.footer} nav={t.nav} a11y={t.a11y} />
      <JsonLd data={jsonLd} />
    </>
  );
}
