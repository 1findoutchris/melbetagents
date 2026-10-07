import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { fmt } from "@/i18n";
import { termsEn } from "@/i18n/legal/en";

export const metadata: Metadata = {
  title: termsEn.title,
  description: fmt(termsEn.description, { site: siteConfig.domain }),
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalPage doc={termsEn} locale="en" />;
}
