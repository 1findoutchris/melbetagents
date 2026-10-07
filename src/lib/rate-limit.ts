import "server-only";

/**
 * Small in-memory sliding-window limiter. It protects a single server
 * instance from bursts; the database check in the applications store
 * enforces the limit across instances.
 */
const hits = new Map<string, number[]>();

export function rateLimitSettings() {
  const max = Number(process.env.RATE_LIMIT_MAX) || 5;
  const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 60;
  return { max, windowMs: windowMinutes * 60_000, windowMinutes };
}

export function consumeLocal(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}
