import { siteConfig } from "@/config/site";
import { fmt, type Dictionary } from "@/i18n";
import { ContactList } from "./ContactList";
import { Wordmark } from "./Wordmark";

export function Footer({
  t,
  nav,
  a11y,
}: {
  t: Dictionary["footer"];
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
}) {
  const { minimumAge, helpUrl, helpName } = siteConfig.responsibleGambling;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Wordmark label={a11y.home} />
            <p>{t.tagline}</p>
          </div>

          <div>
            <h2 className="footer-title">{t.contactTitle}</h2>
            <ContactList t={t} />
          </div>

          <nav aria-label={a11y.footerNav}>
            <h2 className="footer-title">{t.linksTitle}</h2>
            <ul className="footer-list">
              <li>
                <a href="/#apply">{nav.apply}</a>
              </li>
              <li>
                <a href="/#faq">{nav.faq}</a>
              </li>
              <li>
                <a href="/privacy">{t.privacy}</a>
              </li>
              <li>
                <a href="/terms">{t.terms}</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-notices">
          {/* REVIEW BEFORE LAUNCH: wording is driven by siteConfig.operator.relationship. */}
          <div className="notice">
            <h3>{t.relationshipTitle}</h3>
            <p>{fmt(t.relationship[siteConfig.operator.relationship], { operator: siteConfig.operator.legalName })}</p>
          </div>
          <div className="notice">
            <h3>
              <span className="age-badge" aria-hidden="true">
                {minimumAge}+
              </span>
              {fmt(t.rgTitle, { age: minimumAge })}
            </h3>
            <p>
              {fmt(t.rg, { age: minimumAge })}{" "}
              <a href={helpUrl} target="_blank" rel="noopener noreferrer">
                {helpName}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{fmt(t.copyright, { year, site: siteConfig.domain })}</p>
          <p>
            <a href="/privacy">{t.privacy}</a> · <a href="/terms">{t.terms}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
