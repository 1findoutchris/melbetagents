import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getDictionary } from "@/i18n";

const t = getDictionary();

export const alt = t.meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "radial-gradient(circle at 85% 10%, rgba(255,210,31,0.28), #0a0a0c 55%)",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 800 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "#ffd21f",
            color: "#0a0a0c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          M
        </div>
        <span>MELBET</span> <span style={{ color: "#ffd21f", fontSize: 24, letterSpacing: 6 }}>AGENTS</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>{t.hero.titleLead}</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, color: "#ffd21f" }}>
          {t.hero.titleAccent}
        </div>
        <div
          style={{ marginTop: 28, fontSize: 30, color: "#a1a1aa", maxWidth: 900 }}
        >{`${t.form.title} — ${siteConfig.domain}`}</div>
      </div>
    </div>,
    size,
  );
}
