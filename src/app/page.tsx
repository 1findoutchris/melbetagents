import { HomePage } from "@/components/HomePage";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/seo";

const t = getDictionary("en");

export const metadata = pageMetadata({
  title: t.meta.title,
  description: t.meta.description,
  path: "/",
  absoluteTitle: true,
});

export default function Page() {
  return <HomePage locale="en" />;
}
