import { GuidePage } from "@/components/GuidePage";
import { compareGuideEn } from "@/i18n/guides/en";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: compareGuideEn.metaTitle,
  description: compareGuideEn.description,
  path: compareGuideEn.path,
  absoluteTitle: true,
  type: "article",
});

export default function Page() {
  return <GuidePage g={compareGuideEn} locale="en" />;
}
