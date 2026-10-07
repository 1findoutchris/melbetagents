import { createHash } from "node:crypto";
import { after, NextResponse, type NextRequest } from "next/server";
import { validateApplication, type SubmissionResponse } from "@/lib/application";
import { saveApplication } from "@/lib/applications-store";
import { deliverNotification, processDueNotifications } from "@/lib/notifications";
import { isDatabaseConfigured } from "@/lib/db";
import { consumeLocal, rateLimitSettings } from "@/lib/rate-limit";
import { serverPhoneLib } from "@/lib/phone-server";
import { isLocale } from "@/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_000;
/** Submissions faster than this are almost always automated. */
const MIN_FILL_MS = 3_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function reply(body: SubmissionResponse, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientIp(request: NextRequest): string {
  // Behind a reverse proxy/CDN the first X-Forwarded-For entry is the client.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt && process.env.NODE_ENV === "production") {
    console.warn("[applications] IP_HASH_SALT is not set; IP hashes are weaker than intended.");
  }
  return createHash("sha256")
    .update(`${salt ?? "melbetagents-dev-salt"}:${ip}`)
    .digest("hex");
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients; still subject to every other check
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return reply({ ok: false, error: "rejected" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ ok: false, error: "rejected" }, 415);

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return reply({ ok: false, error: "rejected" }, 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "rejected" }, 400);
  }

  // Spam protection: honeypot must be empty, form must not be filled instantly.
  if (typeof body.website === "string" && body.website.trim() !== "")
    return reply({ ok: false, error: "rejected" }, 400);
  if (typeof body.elapsedMs !== "number" || body.elapsedMs < MIN_FILL_MS)
    return reply({ ok: false, error: "tooFast" }, 400);

  const submissionId = typeof body.submissionId === "string" ? body.submissionId : "";
  if (!UUID.test(submissionId)) return reply({ ok: false, error: "rejected" }, 400);

  const result = validateApplication(body, serverPhoneLib);
  if (!result.ok) return reply({ ok: false, error: "validation", fields: result.errors }, 422);

  if (!isDatabaseConfigured()) {
    console.error("[applications] DATABASE_URL is not configured; application was not saved.");
    return reply({ ok: false, error: "unavailable" }, 503);
  }

  const ipHash = hashIp(clientIp(request));
  const limits = rateLimitSettings();
  // Burst guard per instance (a little looser than the shared limit so retries still work).
  if (!consumeLocal(ipHash, limits.max * 2, limits.windowMs)) return reply({ ok: false, error: "rateLimited" }, 429);

  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "en";

  try {
    const stored = await saveApplication({
      application: result.value,
      submissionId,
      locale,
      ipHash,
      userAgent: request.headers.get("user-agent"),
      rateLimit: { max: limits.max, windowMinutes: limits.windowMinutes },
    });

    switch (stored.kind) {
      case "rateLimited":
        return reply({ ok: false, error: "rateLimited" }, 429);
      case "duplicate":
        return reply({ ok: true, reference: stored.reference, duplicate: true }, 200);
      case "retry":
        return reply({ ok: true, reference: stored.reference }, 200);
      case "created":
        // Notify the staff Telegram group after the response is sent. The application is
        // already saved, so a Telegram problem never changes what the applicant sees.
        after(async () => {
          try {
            await deliverNotification(stored.id);
            // Also retry any earlier notifications that are due (e.g. after a rate limit).
            await processDueNotifications(5);
          } catch (error) {
            console.error(
              "[telegram] notification processing error:",
              error instanceof Error ? error.message : "unknown",
            );
          }
        });
        return reply({ ok: true, reference: stored.reference }, 201);
    }
  } catch (error) {
    console.error("[applications] failed to save application:", error instanceof Error ? error.message : error);
    return reply({ ok: false, error: "server" }, 500);
  }
}

export function GET() {
  return reply({ ok: false, error: "rejected" }, 405);
}
