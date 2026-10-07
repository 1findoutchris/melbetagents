import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n";

/** Renders only the contact channels configured in siteConfig.contact. */
export function ContactList({ t, className = "footer-list" }: { t: Dictionary["footer"]; className?: string }) {
  const { email, telegram, whatsapp, supportHours } = siteConfig.contact;
  const items = [
    email && { label: t.contactEmail, value: email, href: `mailto:${email}` },
    telegram && { label: t.contactTelegram, value: `@${telegram}`, href: `https://t.me/${telegram}` },
    whatsapp && { label: t.contactWhatsapp, value: whatsapp, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  if (items.length === 0) return <p>{t.contactPending}</p>;

  return (
    <dl className={className}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>
            <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
              {item.value}
            </a>
          </dd>
        </div>
      ))}
      {supportHours && (
        <div>
          <dt>{t.supportHours}</dt>
          <dd>{supportHours}</dd>
        </div>
      )}
    </dl>
  );
}
