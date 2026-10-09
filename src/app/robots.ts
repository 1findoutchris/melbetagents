import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Google must crawl a URL to read its noindex metadata/header. APIs remain
    // protected by server validation/auth, never by robots.txt.
    rules: [{ userAgent: "*", allow: "/" }],
    ...(process.env.SITE_NOINDEX !== "true" ? { sitemap: `${siteUrl()}/sitemap.xml` } : {}),
  };
}
