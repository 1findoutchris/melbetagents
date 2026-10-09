import type { Metadata } from "next";
import { siteConfig, siteUrl } from "@/config/site";
import { getDictionary, localeMeta, type Locale } from "@/i18n";
import searchPages from "@/config/search-pages.json";

/** Unique title, description, canonical and social tags for one page. */
export function pageMetadata({
  title,
  description,
  path,
  locale = "en",
  absoluteTitle = false,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  absoluteTitle?: boolean;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const page = searchPages.find((page) => page.path === path);
  if (!page) throw new Error(`Missing search route policy for ${path}`);
  const url = `${siteUrl()}${path === "/" ? "" : path}`;
  const image = { url: "/opengraph-image.png", width: 1200, height: 630, alt: getDictionary(locale).meta.ogAlt };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    ...(!page.indexable ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      locale: localeMeta[locale].ogLocale,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}

export function breadcrumbJsonLd(path: string, name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl()}/` },
      { "@type": "ListItem", position: 2, name, item: `${siteUrl()}${path}` },
    ],
  };
}

/** WebSite (always) and Organization (only once operator details are confirmed). */
export function siteJsonLd(locale: Locale = "en") {
  const url = siteUrl();
  const t = getDictionary(locale);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url: `${url}/`,
      name: siteConfig.name,
      description: t.meta.description,
      inLanguage: localeMeta[locale].lang,
    },
  ];
  const { operator, contact } = siteConfig;
  if (operator.confirmed) {
    const contactPoint = [
      contact.email && { "@type": "ContactPoint", contactType: "agent applications", email: contact.email },
      contact.whatsapp && { "@type": "ContactPoint", contactType: "agent applications", telephone: contact.whatsapp },
    ].filter(Boolean);
    graph.push({
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name: operator.legalName,
      url: `${url}/`,
      ...(contactPoint.length ? { contactPoint } : {}),
      ...(contact.telegram ? { sameAs: [`https://t.me/${contact.telegram}`] } : {}),
    });
    (graph[0] as Record<string, unknown>).publisher = { "@id": `${url}/#organization` };
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
