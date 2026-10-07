import { siteConfig } from "@/config/site";
import { fmt, type Dictionary } from "@/i18n";
import { Logo } from "./Brand";
import { ContactList } from "./ContactList";

export function Footer({
  t,
  nav,
  a11y,
}: {
  t: Dictionary["footer"];
  nav: Dictionary["nav"];
  a11y: Dictionary["a11y"];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo label={a11y.home} />
            <p>{t.tagline}</p>
          </div>

          <nav aria-label={a11y.footerNav}>
            <h2 className="footer-title">{t.linksTitle}</h2>
            <ul className="footer-list">
              <li>
                <a href="/#about">{nav.about}</a>
              </li>
              <li>
                <a href="/#benefits">{nav.benefits}</a>
              </li>
              <li>
                <a href="/#agent-types">{nav.agentTypes}</a>
              </li>
              <li>
                <a href="/#how-it-works">{nav.howItWorks}</a>
              </li>
              <li>
                <a href="/#faq">{nav.faq}</a>
              </li>
              <li>
                <a href="/#apply">{nav.apply}</a>
              </li>
              <li>
                <a href="/guides/melbet-1xbet-payment-agents">{t.guides}</a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="footer-title">{t.contactTitle}</h2>
            <ContactList t={t} />
          </div>

          <div>
            <h2 className="footer-title">{t.legalTitle}</h2>
            <ul className="footer-list">
              <li>
                <a href="/privacy">{t.privacy}</a>
              </li>
              <li>
                <a href="/terms">{t.terms}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{fmt(t.copyright, { year, site: siteConfig.displayName })}</p>
          <p>
            <a href="/privacy">{t.privacy}</a> · <a href="/terms">{t.terms}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
