import type { Dictionary } from "@/i18n";
import { IconArrowDown, IconArrowUp, IconInfo } from "./Icons";

/**
 * Decorative dashboard mock-up. All figures are hard-coded samples and are
 * labelled "Illustrative example" — they are not real balances or earnings.
 */
const SAMPLE = {
  currency: "USD",
  balance: "2,480.00",
  transactions: [
    { kind: "deposit", ref: "#10482", time: "10:24", amount: "+50.00", done: true },
    { kind: "withdrawal", ref: "#10479", time: "09:58", amount: "−35.00", done: true },
    { kind: "deposit", ref: "#10475", time: "09:12", amount: "+120.00", done: false },
  ],
  bars: [38, 52, 44, 68, 60, 82, 30],
} as const;

export function DashboardIllustration({ t }: { t: Dictionary["dashboard"] }) {
  return (
    <figure className="dash" style={{ margin: 0 }} aria-label={`${t.label}: ${t.title}`}>
      <figcaption className="sr-only">{t.ariaDescription}</figcaption>

      <div className="dash__ribbon">
        <div className="dash__title">
          <span className="dash__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          {t.title}
        </div>
        <span className="illustrative-tag">
          <IconInfo size={13} />
          {t.label}
        </span>
      </div>

      <div className="dash__grid" aria-hidden="true">
        <div className="dash__card dash__card--balance">
          <div>
            <div className="dash__label">{t.balance}</div>
            <div className="dash__value">
              {SAMPLE.balance}
              <small>{SAMPLE.currency}</small>
            </div>
            <div className="dash__meta">{t.balanceTrend}</div>
          </div>
          <svg className="dash__spark" viewBox="0 0 160 56" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 44 L20 38 L40 41 L60 30 L80 33 L100 22 L120 26 L140 14 L160 10 L160 56 L0 56 Z"
              fill="url(#spark-fill)"
            />
            <path
              className="line"
              d="M0 44 L20 38 L40 41 L60 30 L80 33 L100 22 L120 26 L140 14 L160 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="dash__card">
          <div className="dash__label">{t.activity}</div>
          <ul className="dash__list">
            {SAMPLE.transactions.map((tx) => (
              <li key={tx.ref} className="dash__tx">
                <span className={`dash__tx-icon${tx.kind === "deposit" ? " dash__tx-icon--in" : ""}`}>
                  {tx.kind === "deposit" ? <IconArrowDown size={15} /> : <IconArrowUp size={15} />}
                </span>
                <span className="dash__tx-name">
                  {tx.kind === "deposit" ? t.deposit : t.withdrawal}
                  <span>
                    {tx.ref} · {tx.time}
                    <em
                      className={`status-pill${tx.done ? "" : " status-pill--pending"}`}
                      style={{ fontStyle: "normal" }}
                    >
                      {tx.done ? t.completed : t.pending}
                    </em>
                  </span>
                </span>
                <span className="dash__tx-amt">{tx.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="dash__card">
          <div className="dash__label">{t.commission}</div>
          <div className="dash__meta">{t.commissionNote}</div>
          <div className="dash__bars">
            {SAMPLE.bars.map((height, i) => (
              <div key={i} className={`dash__bar${i === SAMPLE.bars.length - 1 ? " dash__bar--muted" : ""}`}>
                <i style={{ height: `${height}%`, ["--i" as string]: i }} />
                {t.days[i]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="dash__footnote">{t.labelNote}</p>
    </figure>
  );
}
