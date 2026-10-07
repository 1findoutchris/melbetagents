# melbetagents.org

A recruitment website for payment agents. It explains the role, the onboarding steps and the agent types, and it collects applications into PostgreSQL. Staff can optionally get a Telegram notification for each new application.

- **Stack:** Next.js 16 (App Router, TypeScript), React 19, PostgreSQL via `pg`. The app uses no UI framework, so the page ships very little JavaScript.
- **Pages:** `/` (landing page and application form), `/privacy`, `/terms`, plus `robots.txt`, `sitemap.xml`, a favicon, an Apple touch icon and an Open Graph image.
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
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`      | Optional              | When both are set, each new application is sent to that chat from the server, after the application is saved.                                                                |
| `SITE_URL`                                     | Optional              | Canonical URL for metadata and the sitemap. Defaults to `https://melbetagents.org`.                                                                                          |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MINUTES` | Optional              | Applications allowed per IP per window. The default is 5 per 60 minutes.                                                                                                     |

### Telegram notifications

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy the token.
2. Add the bot to your private staff group and send any message in that group.
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `chat.id`. Group IDs are negative numbers.
4. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` on the server.

The notification is sent after the response, using Next.js `after()`. If it fails, the error is logged and the applicant is not affected. Successful sends set `notified_at` on the row.

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

### Partner logo strip

`src/components/LogoStrip.tsx` displays partner logos, such as Juventus and LaLiga, in a centred strip. Each logo keeps its proportions and is sized to look visually balanced with the others. The strip only appears when **all** of these are true:

- `siteConfig.partners.enabled` is `true`.
- `siteConfig.partners.label` holds the confirmed relationship wording, for example "Official partner of".
- `siteConfig.partners.logos` lists authentic files placed in `public/partners/`, each with its real pixel width and height.

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

1. **Relationship with Melbet:** `siteConfig.operator.relationship` defaults to `"independent"`. With that setting, the footer and the Terms say the site is **not** owned or operated by Melbet and is not an official Melbet website. Switch to `"authorized"` or `"official"` only with written confirmation from Melbet, and have the resulting wording reviewed.
2. **Operator legal name:** `siteConfig.operator.legalName`.
3. **Trademark use:** the "MELBET Agents" text wordmark, the "M" favicon and the page title ("Become a Melbet Payment Agent") use the Melbet name. Confirm you are permitted to use the name and domain this way, and replace them with authorized brand assets if you receive any.
4. **Contact channels and support hours:** these are all `null`, so the site currently says "Use the application form and we will contact you" and shows no hours.
5. **Agent types:** confirm which types are offered and set each to `open`, `confirm` or `hidden`.
6. **Commission terms:** the site only says commission is set out in the agent agreement. Set `commission.publicSummary` only once the terms are publishable. When set, it appears on the commission benefit card.
7. **Countries and payment methods:** confirm whether to restrict the country list. The FAQ says availability is confirmed per applicant.
8. **Currencies** offered next to "estimated starting capital".
9. **Legal review:** the Privacy Policy and Terms are templates. Review them, especially the legal basis, data sharing, retention (24 months by default) and contact details. Then remove the yellow review notice in `src/components/LegalPage.tsx`.
10. **Legality by market:** gambling and payment-agent activity is regulated differently in each country. Confirm where you can lawfully recruit, and restrict the country list to match.
11. **Responsible-gambling resource:** this defaults to Gambling Therapy (international). Replace it with a local service if appropriate.
12. **Partner logos (Juventus, LaLiga):** the logo strip is built but disabled. To turn it on, supply the authentic logo files and the confirmed relationship wording, then set `siteConfig.partners`.
