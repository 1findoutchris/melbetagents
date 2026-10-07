import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_NOINDEX === "true") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    // The application endpoint only accepts POST requests and never returns applicant data,
    // but it is disallowed so crawlers don't waste requests on it.
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
