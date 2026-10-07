import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { siteConfig, siteUrl } from "@/config/site";
import { defaultLocale, getDictionary, localeMeta } from "@/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
  weight: ["600", "700", "800"],
});

const t = getDictionary(defaultLocale);
const meta = localeMeta[defaultLocale];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: t.meta.title, template: `%s | ${siteConfig.name}` },
  description: t.meta.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: t.meta.title,
    description: t.meta.description,
    locale: meta.ogLocale,
  },
  twitter: {
    card: "summary_large_image",
    title: t.meta.title,
    description: t.meta.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={meta.lang} dir={meta.dir} className={`${inter.variable} ${barlow.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables JS-only enhancements (scroll reveal) without hiding content when JS is unavailable. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
