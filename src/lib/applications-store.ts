import "server-only";
import { getPool } from "@/lib/db";
import type { CleanApplication } from "@/lib/application";

export type StoreResult =
  | { kind: "created"; id: string; reference: string }
  | { kind: "retry"; reference: string } // same submissionId already saved
  | { kind: "duplicate"; reference: string } // same phone/Telegram applied recently
  | { kind: "rateLimited" };

/** Human-friendly reference derived from the row id, e.g. "MA-1A2B3C4D". */
export const referenceFor = (id: string) => `MA-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

const DUPLICATE_WINDOW_HOURS = 24;

export async function saveApplication(input: {
  application: CleanApplication;
  submissionId: string;
  locale: string;
  ipHash: string;
  userAgent: string | null;
  rateLimit: { max: number; windowMinutes: number };
}): Promise<StoreResult> {
  const pool = getPool();
  const { application: a } = input;

  // 1. Retried request (double click, flaky network): return the saved row.
  const existing = await pool.query<{ id: string }>("SELECT id FROM agent_applications WHERE submission_id = $1", [
    input.submissionId,
  ]);
  if (existing.rows[0]) return { kind: "retry", reference: referenceFor(existing.rows[0].id) };

  // 2. Same person applied recently with a new form session.
  const duplicate = await pool.query<{ id: string }>(
    `SELECT id FROM agent_applications
      WHERE created_at > now() - make_interval(hours => $3)
        AND (phone = $1 OR lower(telegram) = lower($2))
      ORDER BY created_at DESC LIMIT 1`,
    [a.phone, a.telegram, DUPLICATE_WINDOW_HOURS],
  );
  if (duplicate.rows[0]) return { kind: "duplicate", reference: referenceFor(duplicate.rows[0].id) };

  // 3. Rate limit per hashed IP, shared across server instances.
  const recent = await pool.query<{ count: string }>(
    `SELECT count(*) FROM agent_applications
      WHERE ip_hash = $1 AND created_at > now() - make_interval(mins => $2)`,
    [input.ipHash, input.rateLimit.windowMinutes],
  );
  if (Number(recent.rows[0]?.count ?? 0) >= input.rateLimit.max) return { kind: "rateLimited" };

  const inserted = await pool.query<{ id: string }>(
    `INSERT INTO agent_applications
       (submission_id, full_name, country, city, phone, telegram, whatsapp, agent_type,
        capital_amount, capital_currency, experience, message,
        age_confirmed, privacy_consent, locale, ip_hash, user_agent)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true,true,$13,$14,$15)
     ON CONFLICT (submission_id) DO NOTHING
     RETURNING id`,
    [
      input.submissionId,
      a.fullName,
      a.country,
      a.city,
      a.phone,
      a.telegram,
      a.whatsapp,
      a.agentType,
      a.capitalAmount,
      a.capitalCurrency,
      a.experience,
      a.message,
      input.locale,
      input.ipHash,
      input.userAgent?.slice(0, 400) ?? null,
    ],
  );

  if (inserted.rows[0]) {
    const id = inserted.rows[0].id;
    return { kind: "created", id, reference: referenceFor(id) };
  }

  // Lost a race with a concurrent request carrying the same submissionId.
  const raced = await pool.query<{ id: string }>("SELECT id FROM agent_applications WHERE submission_id = $1", [
    input.submissionId,
  ]);
  if (!raced.rows[0]) throw new Error("Insert returned no row and no existing submission was found");
  return { kind: "retry", reference: referenceFor(raced.rows[0].id) };
}

export async function markNotified(id: string): Promise<void> {
  await getPool().query("UPDATE agent_applications SET notified_at = now() WHERE id = $1", [id]);
}
