import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { fmt } from "@/i18n";
import { privacyEn } from "@/i18n/legal/en";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: privacyEn.title,
  description: fmt(privacyEn.description, { site: siteConfig.domain }),
  path: "/privacy",
});

export default function Page() {
  return <LegalPage doc={privacyEn} locale="en" />;
}
