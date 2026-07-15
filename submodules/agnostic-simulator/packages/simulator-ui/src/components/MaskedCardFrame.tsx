import type { CSSProperties, ReactNode } from "react";

import { cx } from "../class-names";
import classes from "./MaskedCardFrame.module.css";

export type MaskedCardFrameOverlayPosition = "top" | "bottom";

export interface MaskedCardFrameProps {
  children: ReactNode;
  maskBottomPercent?: number;
  overlay?: ReactNode;
  overlayPosition?: MaskedCardFrameOverlayPosition;
  className?: string;
  ariaLabel?: string;
}

export function MaskedCardFrame({
  children,
  maskBottomPercent = 30,
  overlay,
  overlayPosition = "bottom",
  className,
  ariaLabel,
}: MaskedCardFrameProps) {
  const visibleRatio = Math.max(0.05, Math.min(1, (100 - maskBottomPercent) / 100));

  return (
    <div
      className={cx(classes.root, className)}
      style={{ "--masked-card-visible-ratio": visibleRatio } as CSSProperties}
      aria-label={ariaLabel}
    >
      <div className={classes.clip}>
        <div className={classes.content}>{children}</div>
      </div>
      {overlay ? (
        <div className={classes.overlay} data-position={overlayPosition}>
          {overlay}
        </div>
      ) : null}
    </div>
  );
}
