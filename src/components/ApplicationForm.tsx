"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  allowedAgentTypes,
  emptyApplication,
  FIELD_ORDER,
  LIMITS,
  validateApplication,
  type ApplicationField,
  type ApplicationInput,
  type FieldErrors,
  type SubmissionPayload,
  type SubmissionResponse,
} from "@/lib/application";
import { fmt, type Dictionary, type Locale } from "@/i18n";
import { IconAlert, IconArrowRight, IconCheck, IconLock } from "./Icons";

type Props = {
  t: Dictionary["form"];
  agentTypeLabels: Record<string, string>;
  countries: { code: string; name: string }[];
  currencies: readonly string[];
  locale: Locale;
  minimumAge: number;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; reference: string; duplicate: boolean }
  | { kind: "error"; message: string };

function newSubmissionId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // RFC 4122 v4 fallback for older browsers.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function ApplicationForm({ t, agentTypeLabels, countries, currencies, locale, minimumAge }: Props) {
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const [values, setValues] = useState<ApplicationInput>(emptyApplication);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ApplicationField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [showSummary, setShowSummary] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const submissionId = useRef<string>("");
  const readyAt = useRef<number>(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    submissionId.current = newSubmissionId();
    readyAt.current = Date.now();
  }, []);

  // "Apply" links on agent-type cards preselect that type.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLElement>("[data-agent-type]");
      const type = link?.dataset.agentType;
      if (type && (allowedAgentTypes() as string[]).includes(type)) {
        setValues((v) => ({ ...v, agentType: type }));
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const fieldError = (field: ApplicationField) => {
    const code = errors[field];
    return code ? t.errors[code] : undefined;
  };

  const revalidate = useCallback((next: ApplicationInput, fields: ApplicationField[] | "all") => {
    const result = validateApplication(next);
    const all = result.ok ? {} : result.errors;
    setErrors((prev) => {
      if (fields === "all") return all;
      const merged = { ...prev };
      for (const f of fields) {
        if (all[f]) merged[f] = all[f];
        else delete merged[f];
      }
      return merged;
    });
    return all;
  }, []);

  const update =
    (field: ApplicationField) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = event.target;
      const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
      const next = { ...values, [field]: value } as ApplicationInput;
      setValues(next);
      if (status.kind === "error") setStatus({ kind: "idle" });
      // Once a field has been visited, re-check it as the user types so errors clear promptly.
      const related: ApplicationField[] =
        field === "capitalAmount" || field === "capitalCurrency" ? ["capitalAmount", "capitalCurrency"] : [field];
      if (touched[field] || errors[field] || typeof value === "boolean") revalidate(next, related);
    };

  const blur = (field: ApplicationField) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Don't flag empty required fields just because focus passed through them.
    const raw = values[field];
    if (typeof raw === "string" && raw.trim() === "" && !errors[field]) return;
    revalidate(values, [field]);
  };

  const focusField = (field: ApplicationField) => {
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "submitting") return;

    const all = revalidate(values, "all");
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    const invalid = FIELD_ORDER.filter((f) => all[f]);
    if (invalid.length > 0) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);
    setStatus({ kind: "submitting" });

    const payload: SubmissionPayload = {
      ...values,
      website: honeypot,
      elapsedMs: readyAt.current ? Date.now() - readyAt.current : 0,
      submissionId: submissionId.current || newSubmissionId(),
      locale,
    };

    let data: SubmissionResponse | null = null;
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      data = (await response.json().catch(() => null)) as SubmissionResponse | null;
      if (!data) data = { ok: false, error: "server" };
    } catch {
      setStatus({ kind: "error", message: t.status.network });
      requestAnimationFrame(() => alertRef.current?.focus());
      return;
    }

    if (data.ok) {
      setStatus({ kind: "success", reference: data.reference, duplicate: Boolean(data.duplicate) });
      requestAnimationFrame(() => {
        successRef.current?.focus();
        successRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }

    if (data.error === "validation" && data.fields) {
      setErrors(data.fields);
      setStatus({ kind: "idle" });
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const message =
      data.error === "tooFast"
        ? t.status.tooFast
        : data.error === "rateLimited"
          ? t.status.rateLimited
          : data.error === "unavailable"
            ? t.status.unavailable
            : data.error === "rejected"
              ? t.status.rejected
              : t.status.server;
    setStatus({ kind: "error", message });
    requestAnimationFrame(() => alertRef.current?.focus());
  }

  function startOver() {
    setValues(emptyApplication);
    setErrors({});
    setTouched({});
    setShowSummary(false);
    submissionId.current = newSubmissionId();
    readyAt.current = Date.now();
    setStatus({ kind: "idle" });
  }

  if (status.kind === "success") {
    return (
      <div className="success" role="status" aria-live="polite">
        <div className="success__icon" aria-hidden="true">
          <IconCheck size={34} strokeWidth={2.5} />
        </div>
        <h3 ref={successRef} tabIndex={-1}>
          {status.duplicate ? t.status.duplicateTitle : t.status.successTitle}
        </h3>
        <p>{status.duplicate ? t.status.duplicateBody : t.status.successBody}</p>
        <div className="success__ref">
          <span>{t.status.reference}</span>
          <strong>{status.reference}</strong>
        </div>
        <div>
          <button type="button" className="btn btn--ghost" onClick={startOver}>
            {t.status.newApplication}
          </button>
        </div>
      </div>
    );
  }

  const invalidFields = FIELD_ORDER.filter((f) => errors[f]);
  const submitting = status.kind === "submitting";

  const describedBy = (field: ApplicationField, hasHint = false) =>
    [hasHint ? id(`${field}-hint`) : null, errors[field] ? id(`${field}-error`) : null].filter(Boolean).join(" ") ||
    undefined;

  const errorText = (field: ApplicationField) =>
    errors[field] ? (
      <p id={id(`${field}-error`)} className="field__error">
        <IconAlert size={15} />
        {fieldError(field)}
      </p>
    ) : null;

  const fieldLabel = (field: string, children: ReactNode, required = false) => (
    <label htmlFor={id(field)} className="field__label">
      <span>{children}</span>
      <span className={`field__tag${required ? " field__tag--req" : ""}`}>{required ? t.required : t.optional}</span>
    </label>
  );

  const labelFor = (field: ApplicationField): string => {
    switch (field) {
      case "capitalAmount":
      case "capitalCurrency":
        return `${t.fields.capital.label} (${field === "capitalAmount" ? t.fields.capital.amountLabel : t.fields.capital.currencyLabel})`;
      case "ageConfirmed":
        return fmt(t.fields.ageConfirmed.label, { age: minimumAge });
      case "privacyConsent":
        return `${t.fields.privacyConsent.before} ${t.fields.privacyConsent.link}`;
      default:
        return t.fields[field].label;
    }
  };

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-busy={submitting} aria-describedby={id("intro")}>
      <p id={id("intro")} className="sr-only">
        {t.lead}
      </p>

      {showSummary && invalidFields.length > 0 && (
        <div ref={summaryRef} className="alert" role="alert" tabIndex={-1}>
          <IconAlert size={20} />
          <div>
            <strong>{fmt(t.errorSummary, { count: invalidFields.length })}</strong>
            <ul>
              {invalidFields.map((field) => (
                <li key={field}>
                  <a
                    href={`#${id(field)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      focusField(field);
                    }}
                  >
                    {labelFor(field)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {status.kind === "error" && (
        <div ref={alertRef} className="alert" role="alert" tabIndex={-1}>
          <IconAlert size={20} />
          <p>{status.message}</p>
        </div>
      )}

      {/* Honeypot — invisible to people and assistive tech; bots tend to fill it. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={id("website")}>Website</label>
        <input
          id={id("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <fieldset className="form-section">
        <legend className="form-section__title">{t.sections.about}</legend>
        <div className="form-grid">
          <div className="field span-2">
            {fieldLabel("fullName", t.fields.fullName.label, true)}
            <input
              id={id("fullName")}
              name="fullName"
              className="input"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              placeholder={t.fields.fullName.placeholder}
              maxLength={LIMITS.fullName.max}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={describedBy("fullName")}
              value={values.fullName}
              onChange={update("fullName")}
              onBlur={blur("fullName")}
            />
            {errorText("fullName")}
          </div>

          <div className="field">
            {fieldLabel("country", t.fields.country.label, true)}
            <select
              id={id("country")}
              name="country"
              className="select"
              autoComplete="country"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.country)}
              aria-describedby={describedBy("country")}
              value={values.country}
              onChange={update("country")}
              onBlur={blur("country")}
            >
              <option value="">{t.fields.country.placeholder}</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            {errorText("country")}
          </div>

          <div className="field">
            {fieldLabel("city", t.fields.city.label, true)}
            <input
              id={id("city")}
              name="city"
              className="input"
              type="text"
              autoComplete="address-level2"
              autoCapitalize="words"
              placeholder={t.fields.city.placeholder}
              maxLength={LIMITS.city.max}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={describedBy("city")}
              value={values.city}
              onChange={update("city")}
              onBlur={blur("city")}
            />
            {errorText("city")}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend className="form-section__title">{t.sections.contact}</legend>
        <div className="form-grid">
          <div className="field">
            {fieldLabel("phone", t.fields.phone.label, true)}
            <input
              id={id("phone")}
              name="phone"
              className="input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t.fields.phone.placeholder}
              maxLength={24}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describedBy("phone", true)}
              value={values.phone}
              onChange={update("phone")}
              onBlur={blur("phone")}
            />
            <p id={id("phone-hint")} className="field__hint">
              {t.fields.phone.hint}
            </p>
            {errorText("phone")}
          </div>

          <div className="field">
            {fieldLabel("telegram", t.fields.telegram.label, true)}
            <input
              id={id("telegram")}
              name="telegram"
              className="input"
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={t.fields.telegram.placeholder}
              maxLength={40}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.telegram)}
              aria-describedby={describedBy("telegram", true)}
              value={values.telegram}
              onChange={update("telegram")}
              onBlur={blur("telegram")}
            />
            <p id={id("telegram-hint")} className="field__hint">
              {t.fields.telegram.hint}
            </p>
            {errorText("telegram")}
          </div>

          <div className="field span-2">
            {fieldLabel("whatsapp", t.fields.whatsapp.label)}
            <input
              id={id("whatsapp")}
              name="whatsapp"
              className="input"
              type="tel"
              inputMode="tel"
              autoComplete="off"
              placeholder={t.fields.whatsapp.placeholder}
              maxLength={24}
              aria-invalid={Boolean(errors.whatsapp)}
              aria-describedby={describedBy("whatsapp", true)}
              value={values.whatsapp}
              onChange={update("whatsapp")}
              onBlur={blur("whatsapp")}
            />
            <p id={id("whatsapp-hint")} className="field__hint">
              {t.fields.whatsapp.hint}
            </p>
            {errorText("whatsapp")}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend className="form-section__title">{t.sections.role}</legend>
        <div className="form-grid">
          <div className="field span-2">
            {fieldLabel("agentType", t.fields.agentType.label, true)}
            <select
              id={id("agentType")}
              name="agentType"
              className="select"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.agentType)}
              aria-describedby={describedBy("agentType")}
              value={values.agentType}
              onChange={update("agentType")}
              onBlur={blur("agentType")}
            >
              <option value="">{t.fields.agentType.placeholder}</option>
              {allowedAgentTypes().map((type) => (
                <option key={type} value={type}>
                  {type === "unsure" ? t.fields.agentType.unsure : agentTypeLabels[type]}
                </option>
              ))}
            </select>
            {errorText("agentType")}
          </div>

          <div className="field span-2" role="group" aria-labelledby={id("capital-label")}>
            <div className="field__label" id={id("capital-label")}>
              <span>{t.fields.capital.label}</span>
              <span className="field__tag">{t.optional}</span>
            </div>
            <div className="capital-group">
              <div>
                <label htmlFor={id("capitalAmount")} className="sr-only">
                  {t.fields.capital.amountLabel}
                </label>
                <input
                  id={id("capitalAmount")}
                  name="capitalAmount"
                  className="input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={t.fields.capital.placeholder}
                  maxLength={16}
                  aria-invalid={Boolean(errors.capitalAmount)}
                  aria-describedby={[id("capital-hint"), errors.capitalAmount ? id("capitalAmount-error") : ""]
                    .filter(Boolean)
                    .join(" ")}
                  value={values.capitalAmount}
                  onChange={update("capitalAmount")}
                  onBlur={blur("capitalAmount")}
                />
              </div>
              <div>
                <label htmlFor={id("capitalCurrency")} className="sr-only">
                  {t.fields.capital.currencyLabel}
                </label>
                <select
                  id={id("capitalCurrency")}
                  name="capitalCurrency"
                  className="select"
                  aria-invalid={Boolean(errors.capitalCurrency)}
                  aria-describedby={errors.capitalCurrency ? id("capitalCurrency-error") : undefined}
                  value={values.capitalCurrency}
                  onChange={update("capitalCurrency")}
                  onBlur={blur("capitalCurrency")}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p id={id("capital-hint")} className="field__hint">
              {t.fields.capital.hint}
            </p>
            {errorText("capitalAmount")}
            {errorText("capitalCurrency")}
          </div>

          <div className="field span-2">
            {fieldLabel("experience", t.fields.experience.label)}
            <textarea
              id={id("experience")}
              name="experience"
              className="textarea"
              rows={3}
              placeholder={t.fields.experience.placeholder}
              maxLength={LIMITS.experience.max}
              aria-invalid={Boolean(errors.experience)}
              aria-describedby={describedBy("experience")}
              value={values.experience}
              onChange={update("experience")}
              onBlur={blur("experience")}
            />
            {errorText("experience")}
          </div>

          <div className="field span-2">
            {fieldLabel("message", t.fields.message.label)}
            <textarea
              id={id("message")}
              name="message"
              className="textarea"
              rows={4}
              placeholder={t.fields.message.placeholder}
              maxLength={LIMITS.message.max}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy("message")}
              value={values.message}
              onChange={update("message")}
              onBlur={blur("message")}
            />
            <p className="counter" aria-hidden="true">
              {values.message.length}/{LIMITS.message.max}
            </p>
            {errorText("message")}
          </div>
        </div>
      </fieldset>

      <div className="form-section">
        <div className="consents">
          <div>
            <label className={`check${errors.ageConfirmed ? " check--invalid" : ""}`} htmlFor={id("ageConfirmed")}>
              <input
                id={id("ageConfirmed")}
                name="ageConfirmed"
                type="checkbox"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.ageConfirmed)}
                aria-describedby={describedBy("ageConfirmed")}
                checked={values.ageConfirmed}
                onChange={update("ageConfirmed")}
              />
              <span>{fmt(t.fields.ageConfirmed.label, { age: minimumAge })}</span>
            </label>
            {errorText("ageConfirmed")}
          </div>
          <div>
            <label className={`check${errors.privacyConsent ? " check--invalid" : ""}`} htmlFor={id("privacyConsent")}>
              <input
                id={id("privacyConsent")}
                name="privacyConsent"
                type="checkbox"
                required
                aria-required="true"
                aria-invalid={Boolean(errors.privacyConsent)}
                aria-describedby={describedBy("privacyConsent")}
                checked={values.privacyConsent}
                onChange={update("privacyConsent")}
              />
              <span>
                {t.fields.privacyConsent.before}{" "}
                <a href="/privacy" target="_blank" rel="noopener">
                  {t.fields.privacyConsent.link}
                </a>{" "}
                {t.fields.privacyConsent.after}
              </span>
            </label>
            {errorText("privacyConsent")}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                {t.submitting}
              </>
            ) : (
              <>
                {t.submit}
                <IconArrowRight size={20} className="arrow" />
              </>
            )}
          </button>
          <p className="sr-only" role="status" aria-live="polite">
            {submitting ? t.submitting : ""}
          </p>
          <p className="form-note">
            <IconLock size={14} />
            {t.privacyNote}
          </p>
        </div>
      </div>
    </form>
  );
}
