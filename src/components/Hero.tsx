import type { Dictionary } from "@/i18n";
import { DisplayTitle, Football, Honeycomb } from "./Brand";
import { IconArrowRight } from "./Icons";

export function Hero({ t }: { t: Dictionary["hero"] }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <Honeycomb />
      <span className="slash slash--a" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <DisplayTitle as="h1" id="hero-title" className="hero__title" lines={t.titleLines} accent={t.titleAccent} />
          <p className="hero__lead">{t.lead}</p>
          <div className="hero__actions">
            <a href="#apply" className="btn btn--primary btn--lg">
              {t.primaryCta}
              <IconArrowRight size={20} className="arrow" />
            </a>
            <a href="#how-it-works" className="btn btn--outline btn--lg">
              {t.secondaryCta}
            </a>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__ring" />
          <div className="hero__halo" />
          <div className="ball">
            <Football variant="hero" priority sizes="(max-width: 960px) 300px, 500px" />
            <div className="ball__shadow" />
          </div>
        </div>
      </div>
    </section>
  );
}
