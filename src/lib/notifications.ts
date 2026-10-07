import "server-only";
import { getPool } from "@/lib/db";
import { referenceFor } from "@/lib/reference";
import { formatApplicationMessage, isTelegramConfigured, sendGroupMessage, type NotificationRow } from "@/lib/telegram";

/**
 * Delivery of staff notifications for saved applications.
 *
 * Each application row tracks its own notification state. A row is "claimed"
 * atomically before sending, so two server instances never send the same
 * notification at once. Temporary failures are retried with backoff, a bounded
 * number of times; permanent failures (bad chat ID, bot removed, bad token)
 * stop immediately. Applicant data is never logged.
 */

export const MAX_ATTEMPTS = 5;
/** Delay before attempt n+1 (seconds). */
const BACKOFF = [30, 120, 600, 1800];
/** Rate-limit waits up to this long are handled inline, longer ones are scheduled. */
const INLINE_WAIT_LIMIT_S = 15;
/** A claim older than this is treated as abandoned (e.g. the process died mid-send). */
const STALE_CLAIM_MINUTES = 5;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Initial status for a new row. */
export function initialNotifyStatus(): "pending" | "not_configured" {
  return isTelegramConfigured() ? "pending" : "not_configured";
}

type Claimed = NotificationRow & { id: string; notify_attempts: number };

async function claim(id: string): Promise<Claimed | null> {
  const { rows } = await getPool().query<Claimed>(
    `UPDATE agent_applications
        SET notify_status = 'sending', notify_claimed_at = now(), notify_attempts = notify_attempts + 1
      WHERE id = $1
        AND notify_attempts < $2
        AND (
          (notify_status = 'pending' AND (notify_next_attempt_at IS NULL OR notify_next_attempt_at <= now()))
          OR (notify_status = 'sending' AND notify_claimed_at < now() - make_interval(mins => $3))
        )
      RETURNING id, full_name, country, city, phone, telegram, whatsapp, agent_type,
                capital_amount::text AS capital_amount, capital_currency, experience, message,
                created_at, notify_attempts`,
    [id, MAX_ATTEMPTS, STALE_CLAIM_MINUTES],
  );
  const row = rows[0];
  return row ? { ...row, reference: referenceFor(row.id) } : null;
}

async function markSent(id: string, messageId: number) {
  await getPool().query(
    `UPDATE agent_applications
        SET notify_status = 'sent', notified_at = now(), telegram_message_id = $2,
            notify_last_error = NULL, notify_next_attempt_at = NULL, notify_claimed_at = NULL
      WHERE id = $1`,
    [id, messageId],
  );
}

async function markFailed(id: string, attempts: number, error: string, retryable: boolean, retryAfterS?: number) {
  const giveUp = !retryable || attempts >= MAX_ATTEMPTS;
  const delay = Math.max(retryAfterS ?? 0, BACKOFF[Math.min(attempts - 1, BACKOFF.length - 1)]);
  await getPool().query(
    `UPDATE agent_applications
        SET notify_status = $2, notify_last_error = $3, notify_claimed_at = NULL,
            notify_next_attempt_at = CASE WHEN $2 = 'pending' THEN now() + make_interval(secs => $4) ELSE NULL END
      WHERE id = $1`,
    [id, giveUp ? "failed" : "pending", error, delay],
  );
  return { giveUp, delay };
}

/**
 * Tries to deliver one application's notification. Safe to call repeatedly:
 * it does nothing if the row is already sent, being sent, failed or not yet due.
 */
export async function deliverNotification(id: string): Promise<"sent" | "scheduled" | "failed" | "skipped"> {
  if (!isTelegramConfigured()) return "skipped";
  for (let inline = 0; inline < 2; inline++) {
    const row = await claim(id);
    if (!row) return "skipped";
    const result = await sendGroupMessage(formatApplicationMessage(row));
    if (result.ok) {
      await markSent(row.id, result.messageId);
      return "sent";
    }
    const { giveUp, delay } = await markFailed(
      row.id,
      row.notify_attempts,
      result.error,
      result.retryable,
      result.retryAfter,
    );
    // A short rate-limit wait is handled right away; anything longer waits for the next run.
    const waitInline =
      !giveUp && inline === 0 && result.retryAfter !== undefined && result.retryAfter <= INLINE_WAIT_LIMIT_S;
    console.error(
      `[telegram] notification for ${row.reference} failed (attempt ${row.notify_attempts}/${MAX_ATTEMPTS}): ${result.error}` +
        (giveUp ? " — giving up" : ` — retrying in ${waitInline ? result.retryAfter : delay}s`),
    );
    if (giveUp) return "failed";
    if (waitInline) {
      await getPool().query("UPDATE agent_applications SET notify_next_attempt_at = now() WHERE id = $1", [row.id]);
      await sleep(result.retryAfter! * 1000);
      continue;
    }
    return "scheduled";
  }
  return "scheduled";
}

/** Retries notifications that are due. Returns counts only (no applicant data). */
export async function processDueNotifications(limit = 10) {
  const counts = { sent: 0, scheduled: 0, failed: 0, skipped: 0 };
  if (!isTelegramConfigured()) return counts;
  const { rows } = await getPool().query<{ id: string }>(
    `SELECT id FROM agent_applications
      WHERE notify_attempts < $1
        AND ((notify_status = 'pending' AND notify_next_attempt_at <= now())
          -- first attempt never started (e.g. the server stopped right after saving)
          OR (notify_status = 'pending' AND notify_next_attempt_at IS NULL AND notify_attempts = 0
              AND created_at < now() - interval '2 minutes' AND created_at > now() - interval '1 day')
          OR (notify_status = 'sending' AND notify_claimed_at < now() - make_interval(mins => $2)))
      ORDER BY created_at
      LIMIT $3`,
    [MAX_ATTEMPTS, STALE_CLAIM_MINUTES, limit],
  );
  for (const { id } of rows) {
    const outcome = await deliverNotification(id);
    counts[outcome] += 1;
    if (outcome === "scheduled") break; // probably rate-limited: stop for now
  }
  return counts;
}
