import { siteConfig, visibleAgentTypes } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { DisplayTitle, Honeycomb } from "./Brand";
import { IconArrowRight, IconCheck } from "./Icons";

export function AgentTypes({ t }: { t: Dictionary["agentTypes"] }) {
  const types = visibleAgentTypes();
  if (types.length === 0) return null;

  return (
    <section id="agent-types" className="section section--alt" aria-labelledby="agent-types-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <DisplayTitle id="agent-types-title" lines={t.titleLines} accent={t.titleAccent} />
          <p className="section-lead">{t.lead}</p>
        </div>
        <ul className="types">
          {types.map((id, i) => {
            const item = t.items[id];
            const open = siteConfig.agentTypes[id] === "open";
            return (
              <li key={id} className={`type type--${id}`} data-reveal style={{ ["--reveal-i" as string]: i }}>
                {id === "network" ? <Honeycomb /> : <span className="type__art" aria-hidden="true" />}
                <div className="type__top">
                  <span className="type__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`type__badge${open ? " type__badge--open" : ""}`}>
                    {open ? t.badgeOpen : t.badgeConfirm}
                  </span>
                </div>
                <h3 className="type__title">{item.title}</h3>
                <p className="type__summary">{item.summary}</p>
                <ul className="type__points">
                  {item.points.map((point) => (
                    <li key={point}>
                      <IconCheck size={16} />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="type__cta">
                  <a className="text-link" href="#apply" data-agent-type={id}>
                    {t.cta}
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
