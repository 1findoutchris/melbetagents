-- Melbet Agents database schema (PostgreSQL 13+).
-- Idempotent: safe to run repeatedly with `npm run db:migrate`.

CREATE TABLE IF NOT EXISTS agent_applications (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id     uuid NOT NULL UNIQUE,          -- client-generated; makes retries idempotent
  created_at        timestamptz NOT NULL DEFAULT now(),
  status            text NOT NULL DEFAULT 'new'
                    CHECK (status IN ('new', 'contacted', 'in_review', 'approved', 'declined', 'withdrawn')),

  full_name         text NOT NULL,
  country           char(2) NOT NULL,              -- ISO 3166-1 alpha-2
  city              text NOT NULL,
  phone             text NOT NULL,                 -- E.164, e.g. +251912345678
  telegram          text NOT NULL,                 -- username without "@"
  whatsapp          text,
  agent_type        text NOT NULL CHECK (agent_type IN ('cash', 'online', 'network', 'unsure')),
  capital_amount    numeric(14, 2),
  capital_currency  char(3),
  experience        text,
  message           text,

  age_confirmed     boolean NOT NULL CHECK (age_confirmed),
  privacy_consent   boolean NOT NULL CHECK (privacy_consent),
  consented_at      timestamptz NOT NULL DEFAULT now(),
  locale            text NOT NULL DEFAULT 'en',

  ip_hash           text,                          -- salted SHA-256; raw IPs are never stored
  user_agent        text,
  notified_at       timestamptz                    -- set when the Telegram notification succeeds
);

-- Added for international phone fields (ISO country whose calling code was selected).
ALTER TABLE agent_applications ADD COLUMN IF NOT EXISTS phone_country char(2);
ALTER TABLE agent_applications ADD COLUMN IF NOT EXISTS whatsapp_country char(2);

-- Telegram notification tracking. Applicant data is never written to these columns.
--   notify_status: not_configured | pending | sending | sent | failed
ALTER TABLE agent_applications ADD COLUMN IF NOT EXISTS notify_status text NOT NULL DEFAULT 'pending';
ALTER TABLE agent_applications ADD COLUMN IF NOT EXISTS notify_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE agent_applications ADD COLUMN IF NOT EXISTS notify_next_attempt_at timestamptz;
ALTER TABLE agent_applications ADD COLUMN IF NOT EXISTS notify_claimed_at timestamptz;
ALTER TABLE agent_applications ADD COLUMN IF NOT EXISTS notify_last_error text;
ALTER TABLE agent_applications ADD COLUMN IF NOT EXISTS telegram_message_id bigint;
-- Rows created before tracking existed: mark as already handled so they are never re-sent.
UPDATE agent_applications SET notify_status = 'sent' WHERE notified_at IS NOT NULL AND notify_status = 'pending';
-- Older rows that were never attempted are not sent retroactively.
UPDATE agent_applications SET notify_status = 'not_configured'
  WHERE notified_at IS NULL AND notify_status = 'pending' AND notify_attempts = 0
    AND notify_next_attempt_at IS NULL AND created_at < now() - interval '1 hour';

CREATE INDEX IF NOT EXISTS agent_applications_notify_due_idx
  ON agent_applications (notify_next_attempt_at) WHERE notify_status IN ('pending', 'sending');

CREATE INDEX IF NOT EXISTS agent_applications_created_at_idx ON agent_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS agent_applications_ip_hash_idx ON agent_applications (ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS agent_applications_phone_idx ON agent_applications (phone, created_at DESC);
CREATE INDEX IF NOT EXISTS agent_applications_telegram_idx ON agent_applications (lower(telegram), created_at DESC);
