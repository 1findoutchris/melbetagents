import type { Dictionary } from "@/i18n";
import { IconArrowRight } from "./Icons";

export function About({ t }: { t: Dictionary["about"] }) {
  return (
    <section id="about" className="section section--alt" aria-labelledby="about-title">
      <div className="container about">
        <div className="about__intro" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="about-title" className="section-title">
            {t.title}
          </h2>
          <p className="section-lead">{t.lead}</p>
          <a href="#apply" className="btn btn--primary about__cta">
            {t.cta}
            <IconArrowRight size={18} className="arrow" />
          </a>
        </div>
        <ol className="about__list">
          {t.columns.map((column, i) => (
            <li key={column.title} className="about__item" data-reveal style={{ ["--reveal-i" as string]: i }}>
              <span className="about__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="about__title">{column.title}</h3>
                <p className="about__body">{column.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
