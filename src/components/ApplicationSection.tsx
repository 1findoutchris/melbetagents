import { siteConfig, visibleAgentTypes } from "@/config/site";
import { countryOptions } from "@/lib/countries";
import { fmt, type Dictionary, type Locale } from "@/i18n";
import { ApplicationForm } from "./ApplicationForm";
import { ContactList } from "./ContactList";
import { IconCheck } from "./Icons";

export function ApplicationSection({ t, locale }: { t: Dictionary; locale: Locale }) {
  const age = siteConfig.responsibleGambling.minimumAge;
  const agentTypeLabels = Object.fromEntries(visibleAgentTypes().map((id) => [id, t.agentTypes.items[id].title]));
  const hasContact = Object.values(siteConfig.contact).some(Boolean);

  return (
    <section id="apply" className="section section--alt" aria-labelledby="apply-title">
      <div className="container apply">
        <div className="apply__aside">
          <p className="eyebrow">{t.form.eyebrow}</p>
          <h2 id="apply-title" className="section-title">
            {t.form.title}
          </h2>
          <p className="section-lead">{t.form.lead}</p>

          <h3 className="sr-only">{t.form.sideTitle}</h3>
          <ul className="checklist">
            {t.form.sidePoints.map((point) => (
              <li key={point}>
                <IconCheck size={18} />
                {fmt(point, { age })}
              </li>
            ))}
          </ul>

          {hasContact && (
            <div className="aside-contact">
              <h3>{t.form.sideContactTitle}</h3>
              <ContactList t={t.footer} className="footer-list" />
            </div>
          )}
        </div>

        <div className="form-card">
          <ApplicationForm
            t={t.form}
            agentTypeLabels={agentTypeLabels}
            countries={countryOptions(locale, siteConfig.availability.countries)}
            currencies={siteConfig.currencies}
            locale={locale}
            minimumAge={age}
          />
        </div>
      </div>
    </section>
  );
}
