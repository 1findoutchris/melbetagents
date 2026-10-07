import { siteConfig } from "@/config/site";
import { fmt, type Dictionary } from "@/i18n";
import { DashboardIllustration } from "./DashboardIllustration";
import { IconArrowRight, IconCheck } from "./Icons";

export function Hero({ t, dashboard }: { t: Dictionary["hero"]; dashboard: Dictionary["dashboard"] }) {
  const age = siteConfig.responsibleGambling.minimumAge;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container hero__grid">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            {t.titleLead} <span className="accent">{t.titleAccent}</span>
          </h1>
          <p className="hero__lead">{t.lead}</p>
          <div className="hero__actions">
            <a href="#apply" className="btn btn--primary btn--lg">
              {t.primaryCta}
              <IconArrowRight size={20} className="arrow" />
            </a>
            <a href="#how-it-works" className="btn btn--ghost btn--lg">
              {t.secondaryCta}
            </a>
          </div>
          <ul className="hero__points">
            {t.points.map((point) => (
              <li key={point}>
                <IconCheck size={18} />
                {fmt(point, { age })}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero__visual">
          <DashboardIllustration t={dashboard} />
        </div>
      </div>
    </section>
  );
}
