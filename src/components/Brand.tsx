/** The supplied Melbet wordmark (built by scripts/build_assets.py). Original proportions: 564 × 120. */
export function Logo({ label, height }: { label: string; height?: number }) {
  return (
    <a href="/" className="logo">
      <picture>
        <source srcSet="/brand/melbet-logo.webp" type="image/webp" />
        <img
          src="/brand/melbet-logo.png"
          width={564}
          height={120}
          alt={label}
          style={height ? { height } : undefined}
          decoding="async"
        />
      </picture>
    </a>
  );
}

/** Rendered football (scripts/render_football.py). Decorative, so alt is empty. */
export function Football({
  variant = "hero",
  sizes,
  priority = false,
  className,
}: {
  variant?: "hero" | "alt";
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const set =
    variant === "hero"
      ? {
          src: "/images/football-1000.webp",
          srcSet: "/images/football-560.webp 560w, /images/football-1000.webp 1000w",
        }
      : {
          src: "/images/football-alt-640.webp",
          srcSet: "/images/football-alt-360.webp 360w, /images/football-alt-640.webp 640w",
        };
  return (
    <img
      className={className}
      src={set.src}
      srcSet={set.srcSet}
      sizes={sizes}
      width={1000}
      height={1000}
      alt=""
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}

/** Sparse honeycomb outline used as a decorative accent. */
export function Honeycomb({ className }: { className?: string }) {
  // Pointy-top hexagons (r = 26) on a sparse, hand-picked lattice.
  const r = 26;
  const w = Math.sqrt(3) * r;
  const cells: [number, number, boolean?][] = [
    [1, 0],
    [2, 0],
    [0.5, 1],
    [1.5, 1, true],
    [2.5, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [2.5, 3],
    [3.5, 3],
    [3, 4],
  ];
  const hex = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  return (
    <svg className={`honeycomb ${className ?? ""}`} viewBox="0 0 240 330" aria-hidden="true" focusable="false">
      {cells.map(([col, row, filled], i) => {
        const cx = 20 + col * w;
        const cy = 30 + row * r * 1.5;
        return (
          <path key={i} className={filled ? "filled" : undefined} d={`M${hex(cx, cy)}Z`} opacity={filled ? 0.9 : 1} />
        );
      })}
    </svg>
  );
}

/** Large uppercase heading: white lines followed by a yellow accent line. */
export function DisplayTitle({
  as: Tag = "h2",
  id,
  lines,
  accent,
  className = "section-title",
}: {
  as?: "h1" | "h2";
  id?: string;
  lines: string[];
  accent: string;
  className?: string;
}) {
  return (
    <Tag id={id} className={`display ${className}`}>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
      <span className="hl">{accent}</span>
    </Tag>
  );
}
