import "server-only";

/**
 * Telegram Bot API client for staff notifications. Server-only: the bot token
 * and group chat ID come from server environment variables and never reach the
 * browser, the database or the logs.
 */

const MAX_MESSAGE_LENGTH = 4096; // Telegram limit, counted in UTF-16 code units
const REQUEST_TIMEOUT_MS = 10_000;

function config() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  // TELEGRAM_CHAT_ID is accepted as a legacy fallback.
  const chatId = (process.env.TELEGRAM_GROUP_CHAT_ID || process.env.TELEGRAM_CHAT_ID)?.trim();
  const apiBase = (process.env.TELEGRAM_API_BASE || "https://api.telegram.org").replace(/\/$/, "");
  return token && chatId ? { token, chatId, apiBase } : null;
}

export function isTelegramConfigured(): boolean {
  return config() !== null;
}

/** Removes the token from any text before it can reach a log or the database. */
export function redact(text: string): string {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  let out = token ? text.split(token).join("[redacted]") : text;
  out = out.replace(/bot\d{5,}:[A-Za-z0-9_-]{20,}/g, "bot[redacted]");
  return out.slice(0, 300);
}

export type SendResult =
  | { ok: true; messageId: number }
  | {
      ok: false;
      /** Temporary problem (rate limit, network, Telegram 5xx): worth retrying later. */
      retryable: boolean;
      /** Seconds Telegram asked us to wait (429). */
      retryAfter?: number;
      /** Short, data-free description such as "403: Forbidden: bot was kicked from the group chat". */
      error: string;
    };

/** Sends a plain-text message (no parse mode, so user input cannot inject formatting). */
export async function sendGroupMessage(text: string): Promise<SendResult> {
  const cfg = config();
  if (!cfg) return { ok: false, retryable: false, error: "not configured" };

  let response: Response;
  try {
    response = await fetch(`${cfg.apiBase}/bot${cfg.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: cfg.chatId,
        text: fitToLimit(text),
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    return { ok: false, retryable: true, error: redact(`network: ${name}`) };
  }

  type ApiReply = {
    ok: boolean;
    result?: { message_id: number };
    error_code?: number;
    description?: string;
    parameters?: { retry_after?: number; migrate_to_chat_id?: number };
  };
  const body = (await response.json().catch(() => null)) as ApiReply | null;

  if (response.ok && body?.ok && body.result) return { ok: true, messageId: body.result.message_id };

  const code = body?.error_code ?? response.status;
  let error = redact(`${code}: ${body?.description ?? response.statusText}`);
  if (body?.parameters?.migrate_to_chat_id) {
    // The group was upgraded to a supergroup and has a new ID. The destination stays
    // fixed in configuration, so an operator must update TELEGRAM_GROUP_CHAT_ID.
    error = redact(`${error} — group upgraded; set TELEGRAM_GROUP_CHAT_ID to ${body.parameters.migrate_to_chat_id}`);
  }
  if (code === 429) return { ok: false, retryable: true, retryAfter: body?.parameters?.retry_after ?? 30, error };
  if (code >= 500) return { ok: false, retryable: true, error };
  // 400 (bad chat ID, etc.), 401 (bad token), 403 (bot removed): retrying will not help.
  return { ok: false, retryable: false, error };
}

/** Trims the longest free-text fields so the message stays within Telegram's limit. */
function fitToLimit(text: string): string {
  if (text.length <= MAX_MESSAGE_LENGTH) return text;
  const note = "\n\n[Truncated to fit Telegram. Full text is saved in the database.]";
  return text.slice(0, MAX_MESSAGE_LENGTH - note.length - 1) + "…" + note;
}

export type NotificationRow = {
  reference: string;
  full_name: string;
  country: string;
  city: string;
  phone: string;
  telegram: string;
  whatsapp: string | null;
  agent_type: string;
  capital_amount: string | null;
  capital_currency: string | null;
  experience: string | null;
  message: string | null;
  created_at: Date;
};

const AGENT_TYPE_LABELS: Record<string, string> = {
  cash: "Cash agent",
  online: "Online payment agent",
  network: "Network agent",
  unsure: "Not sure yet",
};

const NOT_PROVIDED = "Not provided";
const FIELD_LIMIT = 2000; // form limits keep the whole message under 4096 characters

function clip(value: string): string {
  return value.length > FIELD_LIMIT ? `${value.slice(0, FIELD_LIMIT)}…` : value;
}

function countryName(code: string): string {
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    return name && name !== code ? `${name} (${code})` : code;
  } catch {
    return code;
  }
}

function formatSubmitted(date: Date): string {
  const timeZone = process.env.TELEGRAM_TIMEZONE || "UTC";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
      timeZoneName: "short",
    }).format(date);
  } catch {
    return `${date.toISOString().replace("T", " ").slice(0, 16)} UTC`;
  }
}

function formatCapital(amount: string | null, currency: string | null): string {
  if (amount === null) return NOT_PROVIDED;
  const value = Number(amount);
  const shown = Number.isFinite(value)
    ? value.toLocaleString("en-US", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2,
      })
    : amount;
  return currency ? `${shown} ${currency}` : shown;
}

/** Builds the staff notification text from a stored application. */
export function formatApplicationMessage(row: NotificationRow): string {
  return [
    "📩 NEW MELBET AGENT APPLICATION",
    "",
    `Application ID: ${row.reference}`,
    `Full name: ${row.full_name}`,
    `Country: ${countryName(row.country)}`,
    `City: ${row.city}`,
    `Phone: ${row.phone}`,
    `Telegram: @${row.telegram}`,
    `WhatsApp: ${row.whatsapp ?? NOT_PROVIDED}`,
    `Agent type: ${AGENT_TYPE_LABELS[row.agent_type] ?? row.agent_type}`,
    `Starting capital: ${formatCapital(row.capital_amount, row.capital_currency)}`,
    `Previous experience: ${row.experience ? clip(row.experience) : NOT_PROVIDED}`,
    `Additional message: ${row.message ? clip(row.message) : NOT_PROVIDED}`,
    `Submitted: ${formatSubmitted(row.created_at)}`,
  ].join("\n");
}
