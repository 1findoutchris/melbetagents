import { siteConfig } from "@/config/site";
import { fmt, type Dictionary } from "@/i18n";

/** Height that gives differently shaped logos a similar visual weight, without changing proportions. */
function logoHeight(width: number, height: number, base: number, min: number, max: number) {
  return Math.round(Math.min(max, Math.max(min, base / Math.sqrt(width / height))));
}

export function PartnerLogos({ t, size }: { t: Dictionary["partners"]; size: "sm" | "lg" }) {
  const { logos } = siteConfig.partners;
  const [base, min, max] = size === "lg" ? [64, 48, 72] : [36, 28, 40];
  return (
    <ul className={`partner-logos partner-logos--${size}`}>
      {logos.map((logo) => (
        <li key={logo.name}>
          <img
            src={logo.src}
            alt={fmt(t.logoAlt, { name: logo.name })}
            width={logo.width}
            height={logo.height}
            style={{ height: logoHeight(logo.width, logo.height, base, min, max) }}
            loading="lazy"
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );
}

/** Logo strip near the bottom of the page: logos only, no surrounding text. */
export function LogoStrip({ t }: { t: Dictionary["partners"] }) {
  const { enabled, logos } = siteConfig.partners;
  if (!enabled || logos.length === 0) return null;
  return (
    <section className="logo-strip" aria-label={t.stripLabel}>
      <div className="container">
        <PartnerLogos t={t} size="lg" />
      </div>
    </section>
  );
}
