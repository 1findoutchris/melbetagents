# melbetagents.org

A recruitment website for payment agents. It explains the role, the onboarding steps and the agent types, and it collects applications into PostgreSQL. Staff can optionally get a Telegram notification for each new application.

- **Stack:** Next.js 16 (App Router, TypeScript), React 19, PostgreSQL via `pg`. The app uses no UI framework, so the page ships very little JavaScript.
- **Pages:** `/` (landing page and application form), `/privacy`, `/terms`, `/guides/melbet-1xbet-payment-agents`, plus `robots.txt`, `sitemap.xml`, a favicon, an Apple touch icon and an Open Graph image.
- **API:** `POST /api/applications` validates and stores an application on the server.

---

## Quick start

```bash
npm install
cp .env.example .env.local      # then fill in DATABASE_URL and IP_HASH_SALT
npm run db:migrate              # creates the agent_applications table (idempotent)
npm run dev                     # http://localhost:3000
```

Production:

```bash
npm run build
npm start                       # or deploy to any Node host / Vercel
```

Requires Node 20.9 or newer and PostgreSQL 13 or newer (for `gen_random_uuid()`).

## Environment variables

All of these are read **only on the server**. None use the `NEXT_PUBLIC_` prefix, so none reach the browser.

| Variable                                       | Required              | Purpose                                                                                                                                                                      |
| ---------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                 | **Yes**               | PostgreSQL connection string. Without it the form shows "Applications cannot be received right now" and nothing is saved. The form never fakes a success.                    |
| `DATABASE_SSL`                                 | Hosted DBs            | `require` turns on TLS with certificate verification. `no-verify` turns on TLS without verification, for self-signed certificates only. Leave it empty for a local database. |
| `IP_HASH_SALT`                                 | **Yes in production** | Random secret used to hash applicant IP addresses for rate limiting. Raw IP addresses are never stored.                                                                      |
| `TELEGRAM_BOT_TOKEN`                           | For notifications     | Token of @melbetagentsorgbot. **Secret**: store it only in your host's environment settings.                                                                                 |
| `TELEGRAM_GROUP_CHAT_ID`                       | For notifications     | ID of the staff group that receives notifications (a negative number). It is fixed on the server, so applicants cannot change it.                                            |
| `TELEGRAM_TIMEZONE`                            | Optional              | Time zone for the "Submitted" line, e.g. `Africa/Addis_Ababa`. Default: `UTC`.                                                                                               |
| `CRON_SECRET`                                  | Recommended           | Random secret that protects the notification retry endpoint (`/api/notifications/retry`).                                                                                    |
| `SITE_URL`                                     | Optional              | Canonical URL for metadata and the sitemap. Defaults to `https://melbetagents.org`.                                                                                          |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MINUTES` | Optional              | Applications allowed per IP per window. The default is 5 per 60 minutes.                                                                                                     |

### Telegram notifications

Each saved application is posted to your staff Telegram group by @melbetagentsorgbot, from the server only:

```
📩 NEW MELBET AGENT APPLICATION

Application ID: MA-1A2B3C4D
Full name: …
Country: Kenya (KE)
City: …
Phone: +254712345678
Telegram: @username
WhatsApp: Not provided
Agent type: Cash agent
Starting capital: 1,500.50 USD
Previous experience: Not provided
Additional message: Not provided
Submitted: 7 Oct 2026, 14:24 GMT+3
```

**How it works**

- **Sending:**
  - The message is sent only after the application is validated and saved, and after the applicant's response has already gone out. A Telegram problem never affects the applicant or the saved application.
  - It is plain text with no formatting mode, so nothing an applicant types can change how it renders. Form limits keep it under Telegram's 4,096-character limit, and it is trimmed if it ever exceeds that.
- **Tracking:** each application row records its notification status: `notify_status` (`pending`, `sending`, `sent`, `failed` or `not_configured`), `notify_attempts`, `notify_last_error`, `telegram_message_id` and `notified_at`.
- **Retries:**
  - _Rate limits (429):_ Telegram's `retry_after` is respected. Short waits are handled immediately; longer ones are scheduled.
  - _Network errors and Telegram server errors:_ retried after 30 s, 2 min, 10 min and 30 min, with at most 5 attempts in total.
  - _Permanent errors:_ a wrong chat ID (400), a bad token (401) or the bot being removed from the group (403) stop immediately with `failed`.
  - _Duplicates:_ each row is claimed atomically before sending, so duplicate messages are avoided.
- **When retries run:** after each new submission, and whenever `/api/notifications/retry` is called with `Authorization: Bearer <CRON_SECRET>`. Point a scheduler (Vercel Cron, cron-job.org or similar) at it every 10 minutes so retries continue during quiet periods.
- **Privacy:** logs contain only the application reference, the attempt number and Telegram's error text. The token is never logged; it is redacted from any error output.
- **When Telegram is not configured:** applications are still saved, with `notify_status = 'not_configured'`. They are not sent later.

**Setup**

1. **Add the bot to the group.** In Telegram, open your staff group, then _Add members_ → search `@melbetagentsorgbot` → add.
2. **Permissions.** In a normal group, members can send messages by default, so the bot needs no admin rights. Make it an administrator _only_ if the group restricts who can post (_Group settings → Permissions_), and then grant just _Send messages_.
3. **Find the group chat ID.** Send `/start@melbetagentsorgbot` in the group first.
   - _Recommended:_ on your own computer, put the token in `.env.local` (never committed) and run `npm run telegram:setup`. It shows the bot, any webhook, and the groups it has seen, without printing the token. Group IDs are negative (supergroups start with `-100`).
   - _If a webhook is configured:_ `getUpdates` cannot be used. Read the chat ID from the system that receives the webhook, or temporarily remove the webhook, find the ID, and restore it afterwards. The script tells you if a webhook is set.
   - _If the group is later upgraded to a supergroup:_ its ID changes. The notification error will name the new ID to put in `TELEGRAM_GROUP_CHAT_ID`.
4. **Add the variables in your host.** Add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_GROUP_CHAT_ID`, optionally `TELEGRAM_TIMEZONE`, and `CRON_SECRET` as **server** environment variables in your hosting provider. On Vercel that's _Project → Settings → Environment Variables_, marked for _Production_. Never use a `NEXT_PUBLIC_` prefix, and never commit them.
5. **Redeploy and test.**
   - Run `npm run db:migrate` against the production database, then redeploy.
   - Optional: `npm run telegram:test` sends a data-free test message to the group.
   - Submit an application with obviously fake details. Check that it appears in `agent_applications` with `notify_status = 'sent'` and that the message reaches the group.

`TELEGRAM_API_BASE` exists only to point the code at a local mock Telegram server during automated testing. Leave it unset in production.

## Reviewing applications

Applications are stored in the `agent_applications` table (see `db/schema.sql`). Here is an example query:

```sql
SELECT created_at, full_name, country, city, phone, telegram, whatsapp, agent_type,
       capital_amount, capital_currency, status
FROM agent_applications
ORDER BY created_at DESC;
```

The `status` column (`new`, `contacted`, `in_review`, `approved`, `declined`, `withdrawn`) is there for your workflow. The site does not include an admin UI. Use a database client, or add an authenticated admin later.

## How submission is protected

- **Validation** lives in `src/lib/application.ts`. The browser form and the API share the same rules, and the server always re-validates.
- **Spam:** a hidden honeypot field rejects bots that fill it. Submissions sent less than 3 seconds after the form loads are rejected with a "please review and resubmit" message. The API checks the `Origin` header and limits the request body size.
- **Rate limiting:** a per-instance in-memory burst guard runs first. A database check per hashed IP then applies the limit across all server instances.
- **Duplicate protection:**
  - Each form session sends a random `submissionId`, so double clicks and network retries return the same saved application.
  - A repeat application with the same phone number or Telegram username within 24 hours is not stored twice. The applicant is told that their application was already received.
- **States:** the button shows a loading state and is disabled while submitting. The success screen and reference number (for example `MA-1A2B3C4D`) appear **only after the database insert succeeds**. Database outages, network failures and rate limits each show a clear error, and nothing is saved.

## Where to change things

| What                                                                                                                                                                                             | Where                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Contact details, support hours, the operator's name and relationship to Melbet, agent-type availability, commission summary, country list, currencies, responsible-gambling link, data retention | **`src/config/site.ts`**, the single business configuration file      |
| All visitor-facing copy                                                                                                                                                                          | `src/i18n/dictionaries/en.ts`                                         |
| Privacy Policy and Terms text                                                                                                                                                                    | `src/i18n/legal/en.ts`                                                |
| Colours, spacing, typography                                                                                                                                                                     | Tokens at the top of `src/app/globals.css`                            |
| Logo, favicons, footballs, scenes, social image                                                                                                                                                  | Generated by `npm run assets` (see **Images and brand assets** below) |

### Agent-type availability

Set each entry in `siteConfig.agentTypes` to one of these values:

- `"open"`: shows the "Accepting applications" badge.
- `"confirm"` (the default): shows "Availability confirmed during onboarding".
- `"hidden"`: removes the type from the page and from the form.

### Countries

`siteConfig.availability.countries` is empty by default. In that state every country can be selected, and the site claims no specific coverage. Add ISO codes such as `["ET", "KE"]` to limit the form to those countries, and the server will enforce the same list.

## Images and brand assets

All images are produced by `npm run assets` (`scripts/build_assets.py`, which needs Python 3 with numpy and Pillow) and committed. Run it again only if you change a source file.

| Output                                              | Source                                                                                                                                                          |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/brand/melbet-logo.{webp,png}`               | `assets/brand/melbet-logo-source.webp`, the supplied Melbet wordmark. The black background is removed and the artwork is neither recoloured nor stretched.      |
| `src/app/favicon.ico`, `icon.png`, `apple-icon.png` | `assets/brand/melbet-mark-source.png`, the supplied Melbet circle mark, cut out of its white square                                                             |
| `public/images/football-*.webp`                     | `scripts/render_football.py`: an original, procedurally rendered football (truncated-icosahedron panels, recessed seams, glossy highlight and yellow rim light) |
| `public/images/scene-*.webp`                        | `scripts/render_scenes.py`: an original floodlit stadium scene and goal-net scene                                                                               |
| `src/app/opengraph-image.png`, `twitter-image.png`  | Composed from the logo, the football and Barlow Condensed (`assets/fonts/`, SIL Open Font License)                                                              |

No third-party photography is used. To swap in licensed photography later, replace the files in `public/images/` and keep the same names, or update `src/components/Brand.tsx` and `src/components/SportsShowcase.tsx`.

### Logos

The supplied logos (Juventus, LaLiga, Los Angeles Knight Riders and the flame mascot) are kept as sources in `assets/partners/`. The site serves white, single-colour versions with transparent backgrounds from `public/partners/`. The shapes are unchanged: they are trimmed only to their outer edges and never stretched. The logos appear with no surrounding text, small in the sports section's main panel and larger in the strip above the final call to action. To add, remove or reorder logos, or to hide them, edit `siteConfig.partners`.

## International phone fields

The phone and WhatsApp fields each have a country-code selector, covering every country in `libphonenumber-js`, and a number field.

- **Before a code is chosen**, the selector shows "Select country code" and the number field shows "Enter phone number".
- **After a code is chosen**, the number field shows a real example for that country, and the number is validated against that country's numbering plan.
- **Validation:** the browser uses the compact metadata for instant feedback, and the server re-checks with the full metadata.
- **Storage:** numbers are stored in international format (E.164). The selected countries are stored in `phone_country` and `whatsapp_country`; run `npm run db:migrate` after upgrading.
- **No default country:** none is preselected. When an applicant picks their country of residence, any empty code fields are filled with that country's code, and they can change it.

## Search engines

What is in place:

- **Metadata:** each public page has a unique title, description and canonical URL on `SITE_URL`, plus Open Graph and Twitter tags.
- **Headings:** the home page has a single H1, "Become a Melbet Payment Agent".
- **Structured data:**
  - `WebSite` structured data is published, along with `FAQPage` data that mirrors the visible FAQ.
  - `Organization` data is published only after you set `siteConfig.operator.confirmed: true` with the real operator name.
  - The guide page publishes `Article` and `BreadcrumbList` data.
- **Crawling:** `sitemap.xml` lists the home page, the guide and the legal pages. `robots.txt` permits crawling public pages and noindex responses, and `/api/*` responses send `X-Robots-Tag: noindex`. Applicant data is never rendered on any page.
- **Redirects:** `www.` (or the hosts in `ALTERNATE_HOSTS`) redirects to the canonical domain. Requests that arrive as `http` behind a proxy redirect to `https`. Most hosts, including Vercel, also enforce HTTPS themselves.
- **Guide page:** `/guides/melbet-1xbet-payment-agents` is a neutral guide for people comparing payment agent opportunities. It states that this site recruits Melbet agents only and makes no claims about 1xBet's terms.

### Verify with Google Search Console and submit the sitemap

1. Open [Google Search Console](https://search.google.com/search-console) and choose **Add property**.
2. Choose **Domain**, enter `melbetagents.org`, copy the TXT record Google shows, and add it in your DNS provider. This verifies every variant at once (www and non-www, http and https). Wait for DNS to update, then click **Verify**. _Alternatively_ use a **URL prefix** property (`https://melbetagents.org/`) with the **HTML tag** method: put the `content` value in `GOOGLE_SITE_VERIFICATION`, redeploy, then click **Verify**.
3. In **Sitemaps**, submit `https://melbetagents.org/sitemap.xml`.
4. Use **URL Inspection** on the home page and request indexing if you want it crawled sooner.

Indexing and rankings are decided by Google. Crawling can take days to weeks, and no particular position can be guaranteed.

## Adding Amharic (or another language)

The page components take a dictionary instead of hard-coded strings. Country names come from `Intl.DisplayNames`, so they translate automatically.

1. Copy `src/i18n/dictionaries/en.ts` to `am.ts`, export `am: Dictionary` and translate the values. TypeScript reports any missing keys.
2. Do the same for `src/i18n/legal/en.ts`.
3. Add `"am"` to `locales`, `dictionaries` and `localeMeta` in `src/i18n/index.ts`.
4. Add `src/app/am/page.tsx` that returns `<HomePage locale="am" />`, and add legal routes the same way. To serve a correct `<html lang="am">`, move each language into its own route group with its own root layout.
5. Load a font with Ethiopic glyphs, for example `Noto Sans Ethiopic` via `next/font/google`.
6. Add a language switcher to the header.

## Accessibility and quality checks

The following was checked before handover:

- **Responsive layout:** no horizontal overflow at 1440px desktop, 820px tablet, iPhone 13 and Pixel 7 viewports.
- **Navigation and menu:**
  - There is a skip link and a logical tab order, with a visible yellow focus ring.
  - The mobile menu traps focus and closes on Escape, returning focus to the toggle.
  - The FAQ uses `aria-expanded` and `aria-controls`, and works with Enter and Space.
- **Form errors:**
  - Every field has a label. Invalid fields set `aria-invalid` and link their error with `aria-describedby`.
  - An error summary receives focus and links to each invalid field.
  - Inputs use 16px text so iOS does not zoom in.
- **Inputs:** fields use the right mobile keyboards (`type="tel"`, `inputMode="decimal"`) and autocomplete hints.
- **Motion:** with `prefers-reduced-motion`, scroll reveals, the floating football, entrance animations and smooth scrolling are turned off.
- **Contrast:** body text `#a1a1aa` on `#0a0a0c` is about 7.9:1, and black text on yellow buttons is about 13:1.

Commands:

```bash
npm run typecheck
npm run format:check
```

---

## ⚠️ Business details to confirm before launch

Every item below is marked `REVIEW BEFORE LAUNCH` in the code. Nothing on the site makes these claims until you configure them.

1. **Relationship with Melbet:** visible text now names **Melbet** as the operator (`siteConfig.displayName`, `operator.legalName = "Melbet"`, `relationship: "official"`). This is only correct if Melbet itself operates this website. Previous note: `siteConfig.operator.relationship` defaults to `"independent"`. With that setting, the footer and the Terms say the site is **not** owned or operated by Melbet and is not an official Melbet website. Switch to `"authorized"` or `"official"` only with written confirmation from Melbet, and have the resulting wording reviewed.
2. **Operator legal name:** `siteConfig.operator.legalName`.
3. **Trademark use:** the "MELBET Agents" text wordmark, the "M" favicon and the page title ("Become a Melbet Payment Agent") use the Melbet name. Confirm you are permitted to use the name and domain this way, and replace them with authorized brand assets if you receive any.
4. **Contact channels and support hours:** these are all `null`, so the site currently says "Use the application form and we will contact you" and shows no hours.
5. **Agent types:** confirm which types are offered and set each to `open`, `confirm` or `hidden`.
6. **Commission terms:** the site only says commission is set out in the agent agreement. Set `commission.publicSummary` only once the terms are publishable. When set, it appears on the commission benefit card.
7. **Countries and payment methods:** confirm whether to restrict the country list. The FAQ says availability is confirmed per applicant.
8. **Currencies** offered next to "estimated starting capital".
9. **Legal review:** the Privacy Policy and Terms are templates. Review them, especially the legal basis, data sharing, retention (24 months by default) and contact details.
10. **Legality by market:** gambling and payment-agent activity is regulated differently in each country. Confirm where you can lawfully recruit, and restrict the country list to match.
11. **Responsible-gambling resource:** this defaults to Gambling Therapy (international). Replace it with a local service if appropriate.
12. **Logos:** confirm you are permitted to display the Juventus, LaLiga, Los Angeles Knight Riders and flame mascot logos. Give the flame mascot its proper name in `siteConfig.partners` so its alt text is accurate.
13. **Operator confirmation:** set `siteConfig.operator.confirmed: true` once `legalName` is real, so `Organization` structured data is published.

## SEO maintenance and validation

See [SEO audit](docs/seo-audit.md) and [search operations](docs/search-operations.md).

Every HTML route has an explicit indexing decision in `src/config/search-pages.json`.
The sitemap is generated from that policy; adding/removing a reviewed page updates it
automatically. The build fails when the route list and policy drift. Do not auto-include
new routes without reviewing their privacy/indexing purpose. Private pages must also
use `pageMetadata` (or explicit noindex metadata) and enforce server authentication.
Update `modified` only for a real content/metadata change; omit it when unknown.
For dynamic routes, extend URL enumeration and validation before using them.

```bash
npm ci
npm run build          # includes route coverage guard
npm run typecheck
npm run lint           # currently the same TypeScript check, not ESLint
npm run format:check
npm start
# In another terminal (Python 3; no pip packages required):
npm run seo:check -- --base http://localhost:3000
npm run seo:check -- --base https://melbetagents.org
```

Preview builds use `SITE_NOINDEX=true`; run the checker with `--noindex`.
They remain crawlable so Google can read noindex, and their sitemap is empty.
A Railway environment named `production` refuses to build with that flag enabled.
`SITE_URL` must be an HTTPS origin without a path, query, fragment or credentials.
An alias cannot equal the canonical host (this would create a redirect loop).
Fixed-name images/brand/partner files cache for one day and may serve stale content
while revalidating for seven days. For an immediate asset replacement, change its
filename and referencing source; Next's hashed assets already have immutable caching.
