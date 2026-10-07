import type { Dictionary } from "@/i18n";
import { DisplayTitle, Football } from "./Brand";
import { IconArrowRight } from "./Icons";

export function FinalCta({ t }: { t: Dictionary["finalCta"] }) {
  return (
    <section className="section" aria-labelledby="final-cta-title">
      <div className="container">
        <div className="final-cta" data-reveal>
          <div>
            <DisplayTitle id="final-cta-title" className="" lines={t.titleLines} accent={t.titleAccent} />
            <p>{t.body}</p>
            <a href="#apply" className="btn btn--primary btn--lg">
              {t.cta}
              <IconArrowRight size={20} className="arrow" />
            </a>
          </div>
          <div className="final-cta__visual" aria-hidden="true">
            <div className="hero__ring" />
            <div className="hero__halo" />
            <Football variant="alt" sizes="340px" />
          </div>
        </div>
      </div>
    </section>
  );
}
