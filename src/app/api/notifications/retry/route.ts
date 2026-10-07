import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";
import { processDueNotifications } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Retries Telegram notifications that are due. Call it from a scheduler
 * (e.g. every 10 minutes) with header `Authorization: Bearer <CRON_SECRET>`.
 * Vercel Cron sends this header automatically when CRON_SECRET is set.
 * Returns counts only; never applicant data.
 */
async function handle(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const given = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const authorized =
    Boolean(secret) && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!authorized) return NextResponse.json({ ok: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const counts = await processDueNotifications(20);
  return NextResponse.json({ ok: true, ...counts }, { headers: { "Cache-Control": "no-store" } });
}

export const GET = handle;
export const POST = handle;
