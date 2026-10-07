/**
 * Application form schema and validation, shared by the browser form and the
 * API route so both enforce the same rules. Validation returns error codes
 * rather than messages; messages come from the locale dictionary.
 */
import { siteConfig, visibleAgentTypes, type AgentTypeId } from "@/config/site";
import { isCountryCode } from "@/lib/countries";

export type PreferredAgentType = AgentTypeId | "unsure";

export type ApplicationInput = {
  fullName: string;
  country: string;
  city: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  agentType: string;
  capitalAmount: string;
  capitalCurrency: string;
  experience: string;
  message: string;
  ageConfirmed: boolean;
  privacyConsent: boolean;
};

export type ApplicationField = keyof ApplicationInput;

export type ValidationErrorCode =
  | "required"
  | "tooShort"
  | "tooLong"
  | "invalidPhone"
  | "invalidTelegram"
  | "invalidChoice"
  | "invalidAmount"
  | "currencyRequired"
  | "mustConfirm";

export type FieldErrors = Partial<Record<ApplicationField, ValidationErrorCode>>;

/** Normalised values ready to be stored. */
export type CleanApplication = {
  fullName: string;
  country: string;
  city: string;
  phone: string;
  telegram: string;
  whatsapp: string | null;
  agentType: PreferredAgentType;
  capitalAmount: number | null;
  capitalCurrency: string | null;
  experience: string | null;
  message: string | null;
};

export const LIMITS = {
  fullName: { min: 2, max: 100 },
  city: { min: 2, max: 80 },
  experience: { max: 1000 },
  message: { max: 2000 },
  capitalAmount: { max: 1_000_000_000 },
} as const;

export const FIELD_ORDER: ApplicationField[] = [
  "fullName",
  "country",
  "city",
  "phone",
  "telegram",
  "whatsapp",
  "agentType",
  "capitalAmount",
  "capitalCurrency",
  "experience",
  "message",
  "ageConfirmed",
  "privacyConsent",
];

export const emptyApplication: ApplicationInput = {
  fullName: "",
  country: siteConfig.availability.defaultCountry ?? "",
  city: "",
  phone: "",
  telegram: "",
  whatsapp: "",
  agentType: "",
  capitalAmount: "",
  capitalCurrency: "USD",
  experience: "",
  message: "",
  ageConfirmed: false,
  privacyConsent: false,
};

const collapse = (value: unknown): string => (typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "");

const multiline = (value: unknown): string =>
  typeof value === "string"
    ? value
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    : "";

/** Converts "+251 91-234 5678" to "+251912345678"; returns null when not E.164-like. */
export function normalizePhone(value: string): string | null {
  const compact = value.replace(/[\s\-().]/g, "");
  const withPlus = compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
  return /^\+[1-9]\d{7,14}$/.test(withPlus) ? withPlus : null;
}

/** Telegram usernames: 5–32 characters, letters, digits and underscores, starting with a letter. */
export function normalizeTelegram(value: string): string | null {
  const handle = value
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/t\.me\//i, "");
  return /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(handle) ? handle : null;
}

export function allowedAgentTypes(): PreferredAgentType[] {
  return [...visibleAgentTypes(), "unsure"];
}

export function validateApplication(
  raw: Partial<Record<ApplicationField, unknown>>,
): { ok: true; value: CleanApplication } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};

  const fullName = collapse(raw.fullName);
  if (!fullName) errors.fullName = "required";
  else if (fullName.length < LIMITS.fullName.min) errors.fullName = "tooShort";
  else if (fullName.length > LIMITS.fullName.max) errors.fullName = "tooLong";

  const country = collapse(raw.country).toUpperCase();
  const allowedCountries: readonly string[] = siteConfig.availability.countries;
  if (!country) errors.country = "required";
  else if (!isCountryCode(country) || (allowedCountries.length > 0 && !allowedCountries.includes(country)))
    errors.country = "invalidChoice";

  const city = collapse(raw.city);
  if (!city) errors.city = "required";
  else if (city.length < LIMITS.city.min) errors.city = "tooShort";
  else if (city.length > LIMITS.city.max) errors.city = "tooLong";

  const phoneRaw = collapse(raw.phone);
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  if (!phoneRaw) errors.phone = "required";
  else if (!phone) errors.phone = "invalidPhone";

  const telegramRaw = collapse(raw.telegram);
  const telegram = telegramRaw ? normalizeTelegram(telegramRaw) : null;
  if (!telegramRaw) errors.telegram = "required";
  else if (!telegram) errors.telegram = "invalidTelegram";

  const whatsappRaw = collapse(raw.whatsapp);
  const whatsapp = whatsappRaw ? normalizePhone(whatsappRaw) : null;
  if (whatsappRaw && !whatsapp) errors.whatsapp = "invalidPhone";

  const agentType = collapse(raw.agentType) as PreferredAgentType;
  if (!agentType) errors.agentType = "required";
  else if (!allowedAgentTypes().includes(agentType)) errors.agentType = "invalidChoice";

  const amountRaw = collapse(raw.capitalAmount).replace(/[,\s]/g, "");
  let capitalAmount: number | null = null;
  if (amountRaw) {
    const parsed = Number(amountRaw);
    if (!/^\d+(\.\d{1,2})?$/.test(amountRaw) || !Number.isFinite(parsed) || parsed > LIMITS.capitalAmount.max)
      errors.capitalAmount = "invalidAmount";
    else capitalAmount = parsed;
  }

  const currencyRaw = collapse(raw.capitalCurrency).toUpperCase();
  let capitalCurrency: string | null = null;
  if (capitalAmount !== null) {
    if (!currencyRaw) errors.capitalCurrency = "currencyRequired";
    else if (!(siteConfig.currencies as readonly string[]).includes(currencyRaw))
      errors.capitalCurrency = "invalidChoice";
    else capitalCurrency = currencyRaw;
  }

  const experience = multiline(raw.experience);
  if (experience.length > LIMITS.experience.max) errors.experience = "tooLong";

  const message = multiline(raw.message);
  if (message.length > LIMITS.message.max) errors.message = "tooLong";

  if (raw.ageConfirmed !== true) errors.ageConfirmed = "mustConfirm";
  if (raw.privacyConsent !== true) errors.privacyConsent = "mustConfirm";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      fullName,
      country,
      city,
      phone: phone!,
      telegram: telegram!,
      whatsapp,
      agentType,
      capitalAmount,
      capitalCurrency,
      experience: experience || null,
      message: message || null,
    },
  };
}

/** Shape of the JSON body sent by the form. */
export type SubmissionPayload = ApplicationInput & {
  /** Honeypot: hidden from people, must stay empty. */
  website: string;
  /** Milliseconds between the form becoming interactive and submission. */
  elapsedMs: number;
  /** Random UUID generated per form session; makes retries idempotent. */
  submissionId: string;
  locale: string;
};

export type SubmissionResponse =
  | { ok: true; reference: string; duplicate?: boolean }
  | {
      ok: false;
      error: "validation" | "tooFast" | "rateLimited" | "rejected" | "unavailable" | "server";
      fields?: FieldErrors;
    };
