import type { HTMLAttributes } from "react";

import { cx } from "../class-names";

export interface TurnIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  turn: number;
  phase: string;
  step?: string;
  variant?: "pill" | "ribbon";
}

export function TurnIndicator({
  turn,
  phase,
  step,
  variant = "pill",
  className,
  role,
  "aria-label": ariaLabel,
  ...props
}: TurnIndicatorProps) {
  return (
    <div
      {...props}
      className={cx(
        "turn-indicator inline-flex items-center gap-2 border",
        variant === "pill" &&
          "rounded-full border-[var(--board-border)] bg-[var(--board-surface)] px-3 py-1.5",
        variant === "ribbon" &&
          "min-h-9 rounded-lg border-white/20 bg-[linear-gradient(90deg,rgb(24_16_14_/_94%),rgb(57_30_24_/_9%)),oklch(0.24_0.03_35_/_92%)] px-4 text-white shadow-lg",
        className,
      )}
      role={role ?? "status"}
      aria-label={ariaLabel ?? `Turn ${turn}, Phase ${phase}${step ? `, Step ${step}` : ""}`}
      data-turn-indicator-variant={variant}
    >
      <span
        className={cx(
          "turn-indicator-phase font-bold",
          variant === "pill"
            ? "text-xs uppercase tracking-wide text-[var(--board-text)]"
            : "text-[13px] leading-none text-white",
        )}
      >
        {phase}
      </span>
      <strong
        className={cx(
          "turn-indicator-turn font-black",
          variant === "pill"
            ? "-order-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--game-accent)]/20 px-1.5 text-xs text-[var(--game-accent)]"
            : "text-[13px] leading-none text-white",
        )}
      >
        {variant === "pill" ? turn : `Turn ${turn}`}
      </strong>
      {step && (
        <span className="turn-indicator-step text-xs font-bold text-[var(--board-muted)]">
          {step}
        </span>
      )}
    </div>
  );
}
