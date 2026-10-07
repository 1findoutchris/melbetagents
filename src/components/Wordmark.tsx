/**
 * Text wordmark. Replace with an authorized logo file when one is provided
 * (e.g. <Image src="/brand/logo.svg" …/>); keep the accessible label.
 */
export function Wordmark({ label }: { label: string }) {
  return (
    <a href="/" className="wordmark" aria-label={label}>
      <span className="wordmark__mark" aria-hidden="true">
        M
      </span>
      <span aria-hidden="true">MELBET</span>
      <span className="wordmark__accent" aria-hidden="true">
        Agents
      </span>
    </a>
  );
}
