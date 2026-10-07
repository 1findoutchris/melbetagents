import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { fmt } from "@/i18n";
import { termsEn } from "@/i18n/legal/en";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: termsEn.title,
  description: fmt(termsEn.description, { site: siteConfig.displayName }),
  path: "/terms",
});

export default function Page() {
  return <LegalPage doc={termsEn} locale="en" />;
}
