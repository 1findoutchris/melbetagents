import "server-only";
import type { CleanApplication } from "@/lib/application";

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Sends a staff notification. Runs on the server only; the token never reaches the browser. */
export async function notifyNewApplication(app: CleanApplication, reference: string): Promise<boolean> {
  if (!isTelegramConfigured()) return false;

  const lines = [
    `<b>New agent application</b> · ${escapeHtml(reference)}`,
    "",
    `<b>Name:</b> ${escapeHtml(app.fullName)}`,
    `<b>Location:</b> ${escapeHtml(app.city)}, ${escapeHtml(app.country)}`,
    `<b>Phone:</b> ${escapeHtml(app.phone)}`,
    `<b>Telegram:</b> @${escapeHtml(app.telegram)}`,
    app.whatsapp ? `<b>WhatsApp:</b> ${escapeHtml(app.whatsapp)}` : null,
    `<b>Agent type:</b> ${escapeHtml(app.agentType)}`,
    app.capitalAmount !== null ? `<b>Est. capital:</b> ${app.capitalAmount} ${app.capitalCurrency ?? ""}` : null,
    app.experience ? `<b>Experience:</b> ${escapeHtml(app.experience.slice(0, 500))}` : null,
    app.message ? `<b>Message:</b> ${escapeHtml(app.message.slice(0, 800))}` : null,
  ].filter((line): line is string => line !== null);

  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: lines.join("\n"),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      console.error(`[telegram] notification failed with status ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[telegram] notification failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
