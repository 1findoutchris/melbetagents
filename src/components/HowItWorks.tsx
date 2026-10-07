import type { Dictionary } from "@/i18n";
import { DisplayTitle } from "./Brand";

export function HowItWorks({ t }: { t: Dictionary["howItWorks"] }) {
  return (
    <section id="how-it-works" className="section section--alt" aria-labelledby="how-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <DisplayTitle id="how-title" lines={t.titleLines} accent={t.titleAccent} />
          <p className="section-lead">{t.lead}</p>
        </div>
        <ol className="steps">
          {t.steps.map((step, i) => (
            <li key={step.title} className="step" data-reveal style={{ ["--reveal-i" as string]: i }}>
              <span className="step__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
