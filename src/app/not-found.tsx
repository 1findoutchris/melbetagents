import { getDictionary } from "@/i18n";

export default function NotFound() {
  const t = getDictionary();
  return (
    <main className="container not-found">
      <div>
        <h1 className="section-title">{t.notFound.title}</h1>
        <p>{t.notFound.body}</p>
        <a href="/" className="btn btn--primary">
          {t.notFound.cta}
        </a>
      </div>
    </main>
  );
}
