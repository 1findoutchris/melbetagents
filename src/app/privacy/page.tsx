import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { fmt } from "@/i18n";
import { privacyEn } from "@/i18n/legal/en";

export const metadata: Metadata = {
  title: privacyEn.title,
  description: fmt(privacyEn.description, { site: siteConfig.domain }),
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalPage doc={privacyEn} locale="en" />;
}
