import "server-only";
import { Pool } from "pg";

declare global {
  // Reuse one pool across hot reloads in development.
  var __applicationsPool: Pool | undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  if (!globalThis.__applicationsPool) {
    globalThis.__applicationsPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: sslOption(process.env.DATABASE_SSL),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return globalThis.__applicationsPool;
}

/** DATABASE_SSL: "require" = TLS with certificate verification, "no-verify" = TLS without verification. */
export function sslOption(mode: string | undefined) {
  if (mode === "require") return { rejectUnauthorized: true };
  if (mode === "no-verify") return { rejectUnauthorized: false };
  return undefined;
}
