import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import searchPages from "@/config/search-pages.json";

/** Public, indexable pages only. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.SITE_NOINDEX === "true") return [];
  return searchPages
    .filter((page) => page.indexable)
    .map((page) => ({
      url: `${siteUrl()}${page.path === "/" ? "" : page.path}`,
      // Content/metadata review date, never the build time. Omit if unknown.
      ...(page.modified ? { lastModified: new Date(page.modified) } : {}),
    }));
}
