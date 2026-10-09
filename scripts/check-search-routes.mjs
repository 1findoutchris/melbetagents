import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// Every HTML route must have an explicit indexing decision. New private pages
// must never enter a sitemap just because they exist on disk.
const pages = JSON.parse(await readFile(new URL("../src/config/search-pages.json", import.meta.url), "utf8"));
async function routes(dir, segments = []) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      assert(!entry.name.startsWith("@"), "Add explicit SEO coverage for parallel routes before using them");
      if (!entry.name.startsWith("_")) {
        const next = entry.name.startsWith("(") ? segments : [...segments, entry.name];
        found.push(...(await routes(join(dir, entry.name), next)));
      }
    } else if (/^page\.(tsx?|jsx?)$/.test(entry.name)) {
      found.push(`/${segments.join("/")}`);
    }
  }
  return found;
}
const actual = await routes(new URL("../src/app", import.meta.url).pathname);
assert.equal(new Set(pages.map((p) => p.path)).size, pages.length, "Duplicate search route policy");
assert.deepEqual(
  pages.map((p) => p.path).sort(),
  actual.sort(),
  "Register every added/removed HTML route in search-pages.json; explicitly mark private pages indexable:false",
);
for (const page of pages) {
  assert.equal(typeof page.indexable, "boolean", `Missing indexing decision: ${page.path}`);
  assert(
    page.path === "/" || /^\/[a-z0-9/-]+$/.test(page.path),
    `Dynamic or invalid route needs explicit URL enumeration: ${page.path}`,
  );
  assert(page.path === "/" || !page.path.endsWith("/"), "Use slashless non-home paths");
  if (page.modified) {
    assert(
      /^\d{4}-\d{2}-\d{2}$/.test(page.modified) && !Number.isNaN(Date.parse(page.modified)),
      "Invalid lastmod date",
    );
    assert(page.modified <= new Date().toISOString().slice(0, 10), "Future lastmod date");
  }
}
assert(
  !(process.env.RAILWAY_ENVIRONMENT_NAME === "production" && process.env.SITE_NOINDEX === "true"),
  "Refusing production build with SITE_NOINDEX=true",
);
console.log(`Search route policy passes: ${pages.length} HTML routes reviewed.`);
