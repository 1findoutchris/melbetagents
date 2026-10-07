import { siteConfig, visibleAgentTypes, type AgentTypeId } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { IconArrowRight, IconCash, IconCheck, IconNetwork, IconWallet } from "./Icons";

const ICONS: Record<AgentTypeId, typeof IconCash> = {
  cash: IconCash,
  online: IconWallet,
  network: IconNetwork,
};

export function AgentTypes({ t, applyLabel }: { t: Dictionary["agentTypes"]; applyLabel: string }) {
  const types = visibleAgentTypes();
  if (types.length === 0) return null;

  return (
    <section id="agent-types" className="section section--alt" aria-labelledby="agent-types-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="agent-types-title" className="section-title">
            {t.title}
          </h2>
          <p className="section-lead">{t.lead}</p>
        </div>
        <ul className="card-grid" role="list" style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {types.map((id, i) => {
            const item = t.items[id];
            const Icon = ICONS[id];
            const open = siteConfig.agentTypes[id] === "open";
            return (
              <li key={id} className="card type-card" data-reveal style={{ ["--reveal-i" as string]: i }}>
                <span className={`type-card__badge${open ? " type-card__badge--open" : ""}`}>
                  {open ? t.badgeOpen : t.badgeConfirm}
                </span>
                <h3 className="type-card__title">
                  <span className="card__icon">
                    <Icon size={22} />
                  </span>
                  {item.title}
                </h3>
                <p className="card__body">{item.summary}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>
                      <IconCheck size={16} />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="type-card__cta">
                  <a className="text-link" href="#apply" data-agent-type={id}>
                    {applyLabel}
                    <span className="sr-only">: {item.title}</span>
                    <IconArrowRight size={18} />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
