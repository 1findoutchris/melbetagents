import { en, type Dictionary } from "./dictionaries/en";

/**
 * Supported locales. To add Amharic:
 *  1. create src/i18n/dictionaries/am.ts exporting `am: Dictionary`
 *     (and src/i18n/legal/am.ts for the legal pages),
 *  2. add "am" below and to `dictionaries`/`localeMeta`,
 *  3. add routes under src/app/am/ that render the same page components
 *     with locale="am" (see src/app/page.tsx).
 */
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en };

export const localeMeta: Record<Locale, { lang: string; dir: "ltr" | "rtl"; ogLocale: string }> = {
  en: { lang: "en", dir: "ltr", ogLocale: "en_US" },
};

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Replaces {name} placeholders. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export type { Dictionary };
