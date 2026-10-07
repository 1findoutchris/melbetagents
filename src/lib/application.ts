/**
 * Application form schema and validation, shared by the browser form and the
 * API route so both enforce the same rules. Validation returns error codes
 * rather than messages; messages come from the locale dictionary.
 */
import { siteConfig, visibleAgentTypes, type AgentTypeId } from "@/config/site";
import { isCountryCode } from "@/lib/countries";
import type { PhoneLib } from "@/lib/phone";

export type PreferredAgentType = AgentTypeId | "unsure";

export type ApplicationInput = {
  fullName: string;
  country: string;
  city: string;
  /** ISO country whose calling code the phone number uses, e.g. "KE". */
  phoneCountry: string;
  phone: string;
  telegram: string;
  whatsappCountry: string;
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
  | "selectCode"
  | "phoneCodeMismatch"
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
  /** E.164, e.g. +254712345678 */
  phone: string;
  phoneCountry: string;
  telegram: string;
  whatsapp: string | null;
  whatsappCountry: string | null;
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
  "phoneCountry",
  "phone",
  "telegram",
  "whatsappCountry",
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
  phoneCountry: "",
  phone: "",
  telegram: "",
  whatsappCountry: "",
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

type PhoneCheck = { ok: true; e164: string } | { ok: false; field: "country" | "number"; code: ValidationErrorCode };

/**
 * Validates a number against the selected country's numbering plan. Accepts
 * national format ("0712 345678") or international format ("+254 712 345678").
 */
export function checkPhone(number: string, country: string, lib: PhoneLib): PhoneCheck {
  if (!country || !lib.isSupportedCountry(country)) return { ok: false, field: "country", code: "selectCode" };
  const parsed = lib.parsePhoneNumberFromString(number, country as never);
  if (!parsed || !parsed.isValid()) return { ok: false, field: "number", code: "invalidPhone" };
  if (parsed.countryCallingCode !== lib.getCountryCallingCode(country as never))
    return { ok: false, field: "number", code: "phoneCodeMismatch" };
  return { ok: true, e164: parsed.number };
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
  lib: PhoneLib,
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

  const phoneCountry = collapse(raw.phoneCountry).toUpperCase();
  const phoneRaw = collapse(raw.phone);
  let phone: string | null = null;
  if (!phoneCountry) errors.phoneCountry = "selectCode";
  if (!phoneRaw) errors.phone = "required";
  if (phoneCountry && phoneRaw) {
    const check = checkPhone(phoneRaw, phoneCountry, lib);
    if (check.ok) phone = check.e164;
    else if (check.field === "country") errors.phoneCountry = check.code;
    else errors.phone = check.code;
  }

  const telegramRaw = collapse(raw.telegram);
  const telegram = telegramRaw ? normalizeTelegram(telegramRaw) : null;
  if (!telegramRaw) errors.telegram = "required";
  else if (!telegram) errors.telegram = "invalidTelegram";

  const whatsappCountry = collapse(raw.whatsappCountry).toUpperCase();
  const whatsappRaw = collapse(raw.whatsapp);
  let whatsapp: string | null = null;
  if (whatsappRaw) {
    const check = checkPhone(whatsappRaw, whatsappCountry, lib);
    if (check.ok) whatsapp = check.e164;
    else if (check.field === "country") errors.whatsappCountry = check.code;
    else errors.whatsapp = check.code;
  }

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
      phoneCountry,
      telegram: telegram!,
      whatsapp,
      whatsappCountry: whatsapp ? whatsappCountry : null,
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
