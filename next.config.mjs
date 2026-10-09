/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** Canonical origin. Other hosts listed in ALTERNATE_HOSTS redirect here permanently. */
const canonicalUrl = new URL(process.env.SITE_URL || "https://melbetagents.org");
if (
  canonicalUrl.protocol !== "https:" ||
  canonicalUrl.username ||
  canonicalUrl.password ||
  canonicalUrl.pathname !== "/" ||
  canonicalUrl.search ||
  canonicalUrl.hash
) {
  throw new Error("SITE_URL must be a public HTTPS origin.");
}
const canonical = canonicalUrl.origin;
const canonicalHost = new URL(canonical).host;
const alternateHosts = (process.env.ALTERNATE_HOSTS || `www.${canonicalHost}`)
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);
if (alternateHosts.includes(canonicalHost))
  throw new Error("ALTERNATE_HOSTS must not contain the canonical host (redirect loop).");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Keep the submission endpoint out of search results.
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      ...["images", "brand", "partners"].map((directory) => ({
        source: `/${directory}/:path*`,
        // These filenames can be replaced, so do not cache them as immutable.
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      })),
    ];
  },
  async redirects() {
    return [
      // www (and any other configured alias) -> canonical domain
      ...alternateHosts.map((host) => ({
        source: "/:path*",
        has: [{ type: "host", value: host }],
        destination: `${canonical}/:path*`,
        permanent: true,
      })),
      // http -> https on the canonical domain when running behind a proxy that reports the scheme
      {
        source: "/:path*",
        has: [
          { type: "host", value: canonicalHost },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: `${canonical}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
