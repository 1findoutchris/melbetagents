import type { Dictionary } from "@/i18n";

export function HowItWorks({ t }: { t: Dictionary["howItWorks"] }) {
  return (
    <section id="how-it-works" className="section" aria-labelledby="how-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="how-title" className="section-title">
            {t.title}
          </h2>
          <p className="section-lead">{t.lead}</p>
        </div>
        <ol className="steps">
          {t.steps.map((step, i) => (
            <li key={step.title} className="step" data-reveal style={{ ["--reveal-i" as string]: i }}>
              <span className="step__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="step__content">
                <h3 className="step__title">{step.title}</h3>
                <p className="step__body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
