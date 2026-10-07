"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/i18n";
import { fmt } from "@/i18n";

/** Accordion following the WAI-ARIA pattern: heading > button[aria-expanded] controlling a region. */
export function Faq({ t, age }: { t: Dictionary["faq"]; age: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" className="section section--alt" aria-labelledby="faq-title">
      <div className="container">
        <div className="section-head section-head--center" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="faq-title" className="section-title">
            {t.title}
          </h2>
        </div>
        <div className="faq">
          {t.items.map((item, i) => {
            const open = openIndex === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <div key={item.q} className="faq__item">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="faq__trigger"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    {item.q}
                    <span className="faq__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq__panel"
                  data-open={open}
                  inert={!open}
                >
                  <div>
                    <p>{fmt(item.a, { age })}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
