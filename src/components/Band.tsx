/** Angled divider with a thin yellow stroke, used between major sections. */
export function Band({ variant }: { variant: "to-alt" | "from-alt" }) {
  return <div className={`band band--${variant}`} aria-hidden="true" />;
}
