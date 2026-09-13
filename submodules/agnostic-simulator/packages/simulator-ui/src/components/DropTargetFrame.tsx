import type { CSSProperties, ReactNode } from "react";

import { cx } from "../class-names";

export interface DropTargetTheme {
  /** Game-owned accent applied to the compact frame and status chip. */
  readonly accent: string;
  /** Darker game-owned surface for the status chip. */
  readonly surface: string;
}

export interface DropTargetFrameProps {
  readonly theme: DropTargetTheme;
  readonly label: string;
  /** Optional game-owned glyph that distinguishes a special drop outcome. */
  readonly indicator?: ReactNode;
  readonly activeLabel?: string;
  readonly isOver: boolean;
  readonly testId?: string;
}

/**
 * A deliberately game-neutral drop affordance. Consumers provide their own
 * accent and surface tokens, while this primitive owns only the geometry,
 * compact label placement, and hover emphasis.
 */
export function DropTargetFrame({
  theme,
  label,
  indicator,
  activeLabel,
  isOver,
  testId,
}: DropTargetFrameProps) {
  const style = {
    "--drop-target-accent": theme.accent,
    "--drop-target-surface": theme.surface,
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute -inset-1 z-[18] rounded-[6px] border border-[color:var(--drop-target-accent)] bg-[color:var(--drop-target-accent)]/10 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--drop-target-accent)_18%,transparent),0_5px_14px_-9px_color-mix(in_srgb,var(--drop-target-accent)_90%,transparent)] transition-[border-color,background-color,box-shadow,transform] duration-150 ease-out",
        isOver &&
          "scale-[1.015] border-[color:var(--drop-target-accent)] bg-[color:var(--drop-target-accent)]/20 shadow-[inset_0_0_0_1px_color-mix(in_srgb,white_32%,transparent),0_7px_18px_-8px_color-mix(in_srgb,var(--drop-target-accent)_95%,transparent)]",
      )}
      style={style}
      data-testid={testId}
    >
      <span
        className={cx(
          "absolute left-1/2 top-0 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-[color:var(--drop-target-accent)]/70 bg-[color:var(--drop-target-surface)] px-1.5 py-[2px] text-[7px] font-black uppercase leading-none tracking-[0.12em] text-[color:var(--drop-target-accent)] shadow-sm transition-colors duration-150",
          isOver && "bg-[color:var(--drop-target-accent)] text-white",
        )}
      >
        {indicator}
        {isOver ? (activeLabel ?? label) : label}
      </span>
    </span>
  );
}
