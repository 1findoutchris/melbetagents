import { siteConfig } from "@/config/site";

/**
 * Partner/sponsor logo strip. Renders nothing until siteConfig.partners is
 * enabled with confirmed wording and authentic logo files.
 */
export function LogoStrip() {
  const { enabled, label, logos } = siteConfig.partners;
  if (!enabled || !label || logos.length === 0) return null;
  return (
    <section className="logo-strip" aria-label={label}>
      <div className="container">
        <p className="logo-strip__label">{label}</p>
        <ul>
          {logos.map((logo) => (
            <li key={logo.name}>
              {/* Height is normalised by area so differently shaped logos read at a similar size. */}
              <img
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                style={{ height: Math.round(Math.min(72, Math.max(48, 64 / Math.sqrt(logo.width / logo.height)))) }}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
