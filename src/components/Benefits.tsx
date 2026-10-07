import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { DisplayTitle } from "./Brand";
import { IconChart, IconCompass, IconGrowth, IconHeadset, IconPercent, IconPhone } from "./Icons";

const ICONS = [IconPercent, IconPhone, IconCompass, IconChart, IconHeadset, IconGrowth];

export function Benefits({ t }: { t: Dictionary["benefits"] }) {
  return (
    <section id="benefits" className="section" aria-labelledby="benefits-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <DisplayTitle id="benefits-title" lines={t.titleLines} accent={t.titleAccent} />
          <p className="section-lead">{t.lead}</p>
        </div>
        <ul className="benefits">
          {t.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={item.title} className="benefit" data-reveal style={{ ["--reveal-i" as string]: i % 3 }}>
                <Icon size={36} strokeWidth={1.6} className="benefit__icon" />
                <h3 className="benefit__title">{item.title}</h3>
                <p className="benefit__body">
                  {item.body}
                  {i === 0 && siteConfig.commission.publicSummary ? ` ${siteConfig.commission.publicSummary}` : null}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
