// Applies db/schema.sql to the database in DATABASE_URL.
// Usage: DATABASE_URL=postgres://… npm run db:migrate
import { readFile } from "node:fs/promises";
import pg from "pg";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile?.(file);
  } catch {
    // file is optional
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. See .env.example.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl:
    process.env.DATABASE_SSL === "require"
      ? { rejectUnauthorized: true }
      : process.env.DATABASE_SSL === "no-verify"
        ? { rejectUnauthorized: false }
        : undefined,
});

const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
try {
  await client.connect();
  await client.query(sql);
  console.log("Database schema is up to date.");
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
