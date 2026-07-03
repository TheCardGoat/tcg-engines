import type { HTMLAttributes } from "react";

import { cx } from "../class-names";

export interface TabletopCounterBadgeProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  variant?: "circle" | "compact" | "pill";
}

export function TabletopCounterBadge({
  label,
  value,
  variant = "pill",
  className,
  "aria-label": ariaLabel,
  ...props
}: TabletopCounterBadgeProps) {
  return (
    <div
      {...props}
      className={cx(
        "tabletop-counter-badge",
        variant === "circle" &&
          "grid aspect-square w-[clamp(66px,6.5vw,88px)] place-items-center rounded-full border-[3px] border-white/70 bg-[radial-gradient(circle_at_50%_42%,rgb(255_255_255_/_18%),transparent_36%),var(--game-accent)] text-white shadow-lg",
        variant === "compact" &&
          "grid h-6 min-w-6 place-items-center rounded-full bg-[var(--game-accent)] px-1 text-xs font-black leading-none text-white",
        variant === "pill" &&
          "inline-flex min-h-7 items-center gap-2 rounded-full border border-[var(--board-border)] bg-[var(--board-surface)] px-2.5 text-xs font-extrabold text-[var(--board-text)]",
        className,
      )}
      aria-label={ariaLabel ?? `${label}: ${value}`}
    >
      {variant === "circle" ? (
        <>
          <span className="text-[clamp(30px,3.3vw,46px)] font-black leading-[0.9]">{value}</span>
          <strong className="-mt-2.5 text-[10px] uppercase leading-none">{label}</strong>
        </>
      ) : variant === "compact" ? (
        <span>{value}</span>
      ) : (
        <>
          <span>{label}</span>
          <strong>{value}</strong>
        </>
      )}
    </div>
  );
}
