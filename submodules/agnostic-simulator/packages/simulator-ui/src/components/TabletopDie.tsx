import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { cx } from "../class-names";
import styles from "./TabletopDie.module.css";

export interface TabletopDieProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  label: string;
  /** Already resolved, viewer-safe value. Symbols and nonstandard dice are supported. */
  value?: string | number;
  /** A game-owned face, image, or font glyph. Must not contain interactive controls. */
  children?: ReactNode;
  appearance?: "tile" | "bare";
}

/** A die face only. Rolling, random results, and legal actions belong to the caller. */
export function TabletopDie({
  label,
  value,
  children,
  appearance = "tile",
  className,
  "aria-label": ariaLabel,
  ...props
}: TabletopDieProps) {
  return (
    <span
      {...props}
      role="img"
      aria-label={ariaLabel ?? (value === undefined ? label : `${label} showing ${value}`)}
      className={cx(appearance === "tile" && styles.face, className)}
    >
      {children ?? (
        <>
          <span className={styles.value}>{value ?? "—"}</span>
          <span className={styles.label}>{label}</span>
        </>
      )}
    </span>
  );
}

export interface TabletopDieButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** Name the action, die, and current value, e.g. "Select d6 showing 4". */
  actionLabel: string;
  selected?: boolean;
  children: ReactNode;
}

/** Native keyboard/touch control. `disabled` is supplied by the game adapter. */
export function TabletopDieButton({
  actionLabel,
  selected,
  children,
  className,
  type = "button",
  ...props
}: TabletopDieButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-label={actionLabel}
      aria-pressed={selected}
      className={cx(styles.button, className)}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
