import type { MetadataRoute } from "next";
import { siteConfig, siteUrl } from "@/config/site";
import { compareGuideEn } from "@/i18n/guides/en";

/** Public, indexable pages only. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const legal = new Date(siteConfig.legal.lastUpdated);
  return [
    { url: `${base}/`, lastModified: new Date(siteConfig.contentUpdated), changeFrequency: "monthly", priority: 1 },
    {
      url: `${base}${compareGuideEn.path}`,
      lastModified: new Date(compareGuideEn.updated),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/privacy`, lastModified: legal, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: legal, changeFrequency: "yearly", priority: 0.3 },
  ];
}
