import { cx } from "../class-names";

interface TargetingPreviewBadgeProps {
  x: number;
  y: number;
  damage?: number;
  banish?: boolean;
  label?: string;
}

export function TargetingPreviewBadge({ x, y, damage, banish, label }: TargetingPreviewBadgeProps) {
  return (
    <div
      className={cx(
        "targeting-preview-badge pointer-events-none absolute z-30 inline-flex min-h-6 -translate-x-1/2 -translate-y-full items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-black leading-none shadow-lg",
        damage !== undefined
          ? "border-red-400/40 bg-red-500/20 text-red-300"
          : banish
            ? "border-purple-400/40 bg-purple-500/20 text-purple-300"
            : "border-[var(--game-accent)]/40 bg-[var(--game-accent)]/20 text-[var(--game-accent)]",
      )}
      style={{ left: x, top: y - 8 }}
      aria-label={label ?? `Target preview: ${damage ?? ""} ${banish ? "banish" : ""}`}
    >
      {damage !== undefined && (
        <>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
          <span>{damage}</span>
        </>
      )}
      {banish && (
        <>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Banish</span>
        </>
      )}
      {label && damage === undefined && !banish && <span>{label}</span>}
    </div>
  );
}
