/**
 * Central business configuration for melbetagents.org.
 *
 * Everything that depends on a business decision lives here: contact
 * details, the operator's relationship with Melbet, agent-type availability,
 * commission wording, country availability and support hours.
 *
 * Values marked `REVIEW BEFORE LAUNCH` are placeholders that must be
 * confirmed by the operator. Nothing in this file is a statement of fact
 * until it has been reviewed. Visitor-facing wording lives in
 * `src/i18n/dictionaries/*` so it can be translated.
 */

export type AgentTypeId = "cash" | "online" | "network";

/**
 * - "open": accepting applications for this type.
 * - "confirm": may be offered; availability and terms confirmed during onboarding.
 * - "hidden": not shown on the site and not selectable in the form.
 */
export type AgentTypeAvailability = "open" | "confirm" | "hidden";

/**
 * - "independent": the operator is not owned by or formally partnered with Melbet.
 * - "authorized": the operator holds a confirmed, written authorization from Melbet.
 * - "official": the site is owned and operated by Melbet itself.
 */
export type OperatorRelationship = "independent" | "authorized" | "official";

export const siteConfig = {
  name: "Melbet Agents",
  domain: "melbetagents.org",
  /** Overridden by the SITE_URL environment variable when set. */
  url: "https://melbetagents.org",

  operator: {
    /** REVIEW BEFORE LAUNCH: legal name of the business or person running this site. */
    legalName: "the operator of melbetagents.org",
    /**
     * REVIEW BEFORE LAUNCH. Defaults to "independent", the only wording that is
     * safe until a relationship with Melbet is confirmed in writing. Switching
     * this changes the disclosure in the footer and on the legal pages.
     */
    relationship: "independent" as OperatorRelationship,
  },

  /**
   * REVIEW BEFORE LAUNCH: public contact channels. Leave a value as null to
   * hide it. Do not publish personal numbers you do not want indexed.
   */
  contact: {
    email: null as string | null, // e.g. "agents@melbetagents.org"
    telegram: null as string | null, // username without "@", e.g. "melbetagents_support"
    whatsapp: null as string | null, // international format, e.g. "+251900000000"
    /** Free-text support hours. null = do not show hours anywhere. */
    supportHours: null as string | null,
  },

  /**
   * REVIEW BEFORE LAUNCH: availability for each agent type. "confirm" keeps
   * the type visible but labelled as subject to confirmation.
   */
  agentTypes: {
    cash: "confirm",
    online: "confirm",
    network: "confirm",
  } as Record<AgentTypeId, AgentTypeAvailability>,

  commission: {
    /**
     * REVIEW BEFORE LAUNCH: set only once terms are agreed and publishable,
     * e.g. "Commission is a percentage of each processed transaction, agreed in writing."
     * null = the site says commission terms are explained during onboarding.
     */
    publicSummary: null as string | null,
  },

  availability: {
    /**
     * REVIEW BEFORE LAUNCH: ISO 3166-1 alpha-2 codes of countries where
     * applications are currently considered. Empty = do not claim any
     * specific countries; every country can be selected in the form and
     * the site says availability is confirmed per applicant.
     */
    countries: [] as string[],
    /** Country pre-selected in the form, or null. */
    defaultCountry: null as string | null,
  },

  /** Currencies offered next to "estimated starting capital" in the form. */
  currencies: ["USD", "EUR", "ETB", "KES", "NGN", "GHS", "UGX", "TZS", "XOF", "INR", "BDT", "PKR"],

  responsibleGambling: {
    minimumAge: 18,
    /** International, free support service. Replace with a local service if preferred. */
    helpUrl: "https://www.gamblingtherapy.org/",
    helpName: "Gambling Therapy",
  },

  legal: {
    /** Shown on the Privacy Policy and Terms pages. */
    lastUpdated: "2026-10-07",
    /** How long applications are kept before deletion (shown in the Privacy Policy). */
    retentionMonths: 24,
  },
} as const;

export function visibleAgentTypes(): AgentTypeId[] {
  return (Object.keys(siteConfig.agentTypes) as AgentTypeId[]).filter((id) => siteConfig.agentTypes[id] !== "hidden");
}

export function siteUrl(): string {
  return (process.env.SITE_URL || siteConfig.url).replace(/\/$/, "");
}
