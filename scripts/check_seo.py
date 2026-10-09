"""Read-only SEO regression check. Python 3 standard library, no packages.

python3 scripts/check_seo.py --base http://localhost:3000
python3 scripts/check_seo.py --base https://melbetagents.org
Use --noindex to validate an intentionally non-indexable preview build.
Canonical URLs always use SITE_URL (default https://melbetagents.org).
Never submits applications or calls an authenticated notification endpoint.
"""
import argparse
import json
import os
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import Request, urlopen, build_opener, HTTPRedirectHandler
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.text = []
        self.title = []
        self.h1 = []
        self.schemas = []
        self.ids = set()
        self.active = None
        self.buffer = []
        self.ignored = 0
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag in ("script", "style"):
            self.ignored += 1
        if tag in ("title", "h1") or (tag == "script" and attrs.get("type") == "application/ld+json"):
            self.active = "schema" if tag == "script" else tag
            self.buffer = []

    def handle_endtag(self, tag):
        if self.active and ((tag == self.active) or (tag == "script" and self.active == "schema")):
            text = " ".join(self.buffer).strip() if self.active != "schema" else "".join(self.buffer)
            if self.active == "schema":
                self.schemas.append(json.loads(text))
            else:
                getattr(self, self.active).append(text)
            self.active = None
        if tag in ("script", "style"):
            self.ignored = max(0, self.ignored - 1)

    def handle_data(self, data):
        if self.active:
            self.buffer.append(data)
        if not self.ignored:
            self.text.append(data)

    def meta(self, key):
        return [a.get("content", "") for tag, a in self.tags if tag == "meta" and (a.get("name") == key or a.get("property") == key)]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://localhost:3000")
    parser.add_argument("--noindex", action="store_true")
    args = parser.parse_args()
    base = args.base.rstrip("/")
    canonical = os.environ.get("SITE_URL", "https://melbetagents.org").rstrip("/")
    assert urlsplit(canonical).scheme == "https", "Canonical URLs must use HTTPS"
    policies = json.loads((Path(__file__).resolve().parent.parent / "src/config/search-pages.json").read_text())
    public = {p["path"] for p in policies if p["indexable"]}
    cache = {}
    checks = 0

    def canonical_url(path):
        return canonical + ("" if path == "/" else path)

    def check(condition, message):
        nonlocal checks
        assert condition, message
        checks += 1

    def fetch(path):
        if path not in cache:
            try:
                response = urlopen(Request(base + path, headers={"User-Agent": "MelbetAgents-SEO-Check/1.0"}), timeout=30)
            except HTTPError as error:
                response = error
            cache[path] = (response.status, {k.lower(): v for k, v in response.headers.items()}, response.read(), response.url)
        return cache[path]

    status, _, data, _ = fetch("/robots.txt")
    check(status == 200, "robots.txt must return 200")
    robots = data.decode()
    check("User-Agent: *" in robots and "Allow: /" in robots, "Missing public crawler access")
    check("Disallow:" not in robots, "Do not block pages/resources that need to expose noindex")
    check((f"Sitemap: {canonical}/sitemap.xml" in robots) != args.noindex, "Sitemap declaration does not match index policy")
    status, _, data, _ = fetch("/sitemap.xml")
    check(status == 200, "sitemap.xml must return 200")
    root = ET.fromstring(data)
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    check(root.tag == "{http://www.sitemaps.org/schemas/sitemap/0.9}urlset", "Invalid sitemap namespace/root")
    urls = [el.text for el in root.findall("s:url/s:loc", ns)]
    expected = set() if args.noindex else {canonical_url(path) for path in public}
    check(len(urls) == len(set(urls)) and set(urls) == expected, "Sitemap must contain exactly reviewed canonical public pages")
    for entry in root.findall("s:url", ns):
        loc = entry.find("s:loc", ns).text
        check(not urlsplit(loc).query and not urlsplit(loc).fragment, "Parameterized sitemap URL")
        date = entry.find("s:lastmod", ns)
        policy = next(p for p in policies if canonical_url(p["path"]) == loc)
        check(date is None if not policy.get("modified") else date is not None and date.text.startswith(policy["modified"]), "Inaccurate sitemap lastmod")

    titles, descriptions, pages = set(), set(), {}
    assets, links = set(), set()
    for policy in policies:
        path = policy["path"]
        status, headers, data, final = fetch(path)
        check(status == 200 and final == base + path, f"Unexpected status or redirect: {path}")
        page = Page(data.decode())
        pages[path] = page
        check(len(page.title) == 1 and bool(page.title[0]) and page.title[0] not in titles, f"Missing/duplicate title: {path}")
        titles.update(page.title)
        desc = page.meta("description")
        check(len(desc) == 1 and len(desc[0]) >= 70 and desc[0] not in descriptions, f"Missing/thin/duplicate description: {path}")
        descriptions.update(desc)
        cans = [a.get("href") for tag, a in page.tags if tag == "link" and a.get("rel") == "canonical"]
        check(cans == [canonical_url(path)], f"Wrong canonical: {path}: {cans}")
        robots_meta = ",".join(page.meta("robots") + [headers.get("x-robots-tag", "")]).lower()
        check(("noindex" in robots_meta) == (args.noindex or not policy["indexable"]), f"Unexpected indexing directive: {path}")
        check(len(page.h1) == 1 and len(page.h1[0]) > 3, f"Expected one meaningful H1 in initial HTML: {path}")
        check(any(tag == "main" for tag, _ in page.tags) and len(" ".join(page.text)) > 1000, f"SEO content missing from server HTML: {path}")
        check(page.meta("og:url") == cans, f"OG URL and canonical differ: {path}")
        for key in ("og:title", "og:description", "og:image", "twitter:title", "twitter:description", "twitter:image"):
            check(bool(page.meta(key)), f"Missing {key}: {path}")
        for image in page.meta("og:image") + page.meta("twitter:image"):
            check(image.startswith(canonical + "/"), f"Invalid social image URL: {path}")
            assets.add(urlsplit(image).path)
        check(page.meta("twitter:card") == ["summary_large_image"], f"Invalid Twitter card: {path}")
        query_page = Page(fetch(path + "?utm_source=seo-regression")[2].decode())
        query_cans = [a.get("href") for tag, a in query_page.tags if tag == "link" and a.get("rel") == "canonical"]
        check(query_cans == cans, f"Query parameters changed the canonical: {path}")
        nodes = [node for schema in page.schemas for node in schema.get("@graph", [schema])]
        check(any(node.get("@type") == "WebSite" for node in nodes), f"Missing shared WebSite schema: {path}")
        for schema in page.schemas:
            check(schema.get("@context") == "https://schema.org", f"Invalid JSON-LD context: {path}")
        for node in nodes:
            check(bool(node.get("@type")), f"Missing schema type: {path}")
            if node["@type"] == "BreadcrumbList":
                items = node["itemListElement"]
                check([item["position"] for item in items] == list(range(1, len(items) + 1)) and items[-1]["item"] == canonical + path, f"Invalid breadcrumbs: {path}")
            if node["@type"] == "Article":
                check(node["headline"] == page.h1[0] and node["description"] == desc[0] and node["mainEntityOfPage"] == canonical + path, f"Article does not match visible content: {path}")
            if node["@type"] == "FAQPage":
                text = " ".join(page.text)
                check(all(item["name"] in text and item["acceptedAnswer"]["text"] in text for item in node["mainEntity"]), "FAQ schema must match visible content")
        for tag, attrs in page.tags:
            if tag == "img":
                check("alt" in attrs and int(attrs.get("width", 0)) > 0 and int(attrs.get("height", 0)) > 0, f"Image missing alt/dimensions: {path}")
                check(not attrs.get("src", "").startswith("http:"), "Mixed content image")
                assets.add(urlsplit(urljoin(canonical + path, attrs["src"])).path)
                for item in attrs.get("srcset", "").split(","):
                    if item.strip():
                        assets.add(urlsplit(urljoin(canonical + path, item.strip().split()[0])).path)
                if attrs.get("src") == "/images/football-1000.webp":
                    check(attrs.get("loading") == "eager" and attrs.get("fetchpriority") == "high", "Hero must remain eager/high priority")
            if tag == "a" and attrs.get("href"):
                target = urlsplit(urljoin(canonical + path, attrs["href"]))
                if target.netloc == urlsplit(canonical).netloc:
                    links.add((target.path or "/", unquote(target.fragment)))
            if tag in ("script", "link"):
                src = attrs.get("src") or (attrs.get("href") if attrs.get("rel") in ("stylesheet", "preload") else None)
                if src and urlsplit(urljoin(canonical + path, src)).netloc == urlsplit(canonical).netloc:
                    assets.add(urlsplit(urljoin(canonical + path, src)).path)
    for path, fragment in links:
        status, _, data, _ = fetch(path)
        check(status == 200, f"Broken internal link: {path}")
        if fragment:
            page = pages.get(path) or Page(data.decode())
            check(fragment in page.ids, f"Broken link fragment: {path}#{fragment}")
    for path in assets:
        check(fetch(path)[0] == 200, f"Broken image/CSS/JS asset: {path}")
    for path, expected_status in [("/api/applications", 405), ("/api/notifications/retry", 401)]:
        status, headers, _, _ = fetch(path)
        check(status == expected_status, f"Unexpected API access: {path}")
        check("noindex" in headers.get("x-robots-tag", "").lower(), f"API missing noindex: {path}")
    status, _, data, _ = fetch("/seo-regression-nonexistent")
    check(status == 404 and "noindex" in ",".join(Page(data.decode()).meta("robots")), "Missing real 404/noindex")
    check("max-age=86400" in fetch("/images/football-1000.webp")[1].get("cache-control", ""), "Missing public asset cache policy")

    class NoRedirect(HTTPRedirectHandler):
        def redirect_request(self, *unused_args, **unused_kwargs):
            return None

    opener = build_opener(NoRedirect)
    def redirect(path, headers=None):
        try:
            response = opener.open(Request(base + path, headers=headers or {}), timeout=30)
        except HTTPError as error:
            response = error
        return response.status, response.headers.get("Location", "")

    status, location = redirect("/privacy/")
    check(status == 308 and urljoin(base + "/", location) == base + "/privacy", "Trailing slash must redirect once")
    if urlsplit(base).hostname in ("localhost", "127.0.0.1"):
        host = urlsplit(canonical).netloc
        for headers in [{"Host": "www." + host}, {"Host": host, "X-Forwarded-Proto": "http"}]:
            status, location = redirect("/privacy?utm_source=seo-regression", headers)
            check(status == 308 and location == canonical + "/privacy?utm_source=seo-regression", "Host/scheme redirect must preserve path/query and target HTTPS canonical")
    print(f"PASS: {checks} assertions; {len(policies)} HTML routes, {len(urls)} sitemap URLs, {len(links)} internal links and {len(assets)} assets. {'Preview noindex' if args.noindex else 'Production indexing'} policy validated against {base}.")


if __name__ == "__main__":
    main()
