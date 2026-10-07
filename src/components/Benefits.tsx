import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { IconChart, IconCompass, IconGrowth, IconHeadset, IconPercent, IconPhone } from "./Icons";

const ICONS = [IconPercent, IconPhone, IconCompass, IconChart, IconHeadset, IconGrowth];

export function Benefits({ t }: { t: Dictionary["benefits"] }) {
  return (
    <section id="benefits" className="section" aria-labelledby="benefits-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="benefits-title" className="section-title">
            {t.title}
          </h2>
          <p className="section-lead">{t.lead}</p>
        </div>
        <ul className="card-grid" role="list" style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {t.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={item.title} className="card" data-reveal style={{ ["--reveal-i" as string]: i % 3 }}>
                <div className="card__icon">
                  <Icon />
                </div>
                <h3 className="card__title">{item.title}</h3>
                <p className="card__body">{item.body}</p>
                {i === 0 && siteConfig.commission.publicSummary && (
                  <p className="card__body">{siteConfig.commission.publicSummary}</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
