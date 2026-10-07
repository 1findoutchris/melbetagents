import type { Dictionary } from "@/i18n";
import { DisplayTitle, Football, Honeycomb } from "./Brand";
import { IconInfo } from "./Icons";

/** Image-led platform section. Images are original renders from scripts/render_scenes.py. */
export function SportsShowcase({ t }: { t: Dictionary["sports"] }) {
  const [main, side, brand] = t.panels;
  return (
    <section id="sports" className="section" aria-labelledby="sports-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <DisplayTitle id="sports-title" lines={t.titleLines} accent={t.titleAccent} />
          <p className="section-lead">{t.lead}</p>
        </div>
        <div className="sports">
          <article className="panel panel--main" data-reveal>
            <img
              src="/images/scene-stadium-1600.webp"
              srcSet="/images/scene-stadium-900.webp 900w, /images/scene-stadium-1600.webp 1600w"
              sizes="(max-width: 960px) 100vw, 760px"
              width={1600}
              height={1000}
              alt={main.alt}
              loading="lazy"
              decoding="async"
            />
            <div className="panel__body">
              <span className="panel__tag">{main.tag}</span>
              <h3 className="panel__title">{main.title}</h3>
              <p className="panel__text">{main.text}</p>
            </div>
          </article>
          <article className="panel panel--side panel--net" data-reveal style={{ ["--reveal-i" as string]: 1 }}>
            <img
              src="/images/scene-net-1200.webp"
              srcSet="/images/scene-net-700.webp 700w, /images/scene-net-1200.webp 1200w"
              sizes="(max-width: 960px) 100vw, 480px"
              width={1200}
              height={1200}
              alt={side.alt}
              loading="lazy"
              decoding="async"
            />
            <div className="panel__body">
              <span className="panel__tag">{side.tag}</span>
              <h3 className="panel__title">{side.title}</h3>
              <p className="panel__text">{side.text}</p>
            </div>
          </article>
          <article className="panel panel--side panel--brand" data-reveal style={{ ["--reveal-i" as string]: 2 }}>
            <Honeycomb />
            <div className="panel__ball" aria-hidden="true">
              <Football variant="alt" sizes="300px" />
            </div>
            <div className="panel__body">
              <span className="panel__tag">{brand.tag}</span>
              <h3 className="panel__title">{brand.title}</h3>
              <p className="panel__text">{brand.text}</p>
            </div>
          </article>
        </div>
        <p className="sports-note">
          <IconInfo size={16} />
          {t.note}
        </p>
      </div>
    </section>
  );
}
