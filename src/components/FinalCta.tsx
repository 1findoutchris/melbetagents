import type { Dictionary } from "@/i18n";
import { IconArrowRight } from "./Icons";

export function FinalCta({ t }: { t: Dictionary["finalCta"] }) {
  return (
    <section className="section" aria-labelledby="final-cta-title">
      <div className="container">
        <div className="final-cta" data-reveal>
          <h2 id="final-cta-title">{t.title}</h2>
          <p>{t.body}</p>
          <a href="#apply" className="btn btn--primary btn--lg">
            {t.cta}
            <IconArrowRight size={20} className="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
