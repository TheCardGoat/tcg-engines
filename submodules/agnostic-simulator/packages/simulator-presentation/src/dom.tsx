import type { HTMLAttributes, ReactNode, Ref } from "react";
import { selectionVariables } from "./card-selection";
import "./card.css";
export { DomCardMotion, type DomCardPose } from "./DomCardMotion";

export interface CardSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  imageUrl?: string;
  fallback?: ReactNode;
  back?: ReactNode;
  selected?: boolean;
  interactive?: boolean;
}
/** A persistent two-face card. Its motion controller owns transform and data-face. */
export function CardSurface({
  ref,
  imageUrl,
  fallback,
  back,
  selected,
  interactive,
  children,
  className = "",
  style,
  ...rest
}: CardSurfaceProps) {
  return (
    <div
      {...rest}
      ref={ref}
      className={`tcg-card-surface ${className}`}
      data-face="false"
      data-selected={selected || undefined}
      data-interactive={interactive || undefined}
      style={{ ...selectionVariables, ...style }}
    >
      <div className="tcg-card-back" aria-hidden="true">
        {back ?? <span>✦</span>}
      </div>
      <div className="tcg-card-face">
        {imageUrl && (
          <img
            key={imageUrl}
            src={imageUrl}
            alt=""
            draggable={false}
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
        )}
        {fallback}
      </div>
      {children}
    </div>
  );
}

export { usePresentationCardDrag, cardDragPose, pointInsideCardSpace } from "./card-drag";

/** A result amount, never a target-selection label. Mount at the impact event. */
export function ResolutionValue({ value, x, y }: { value: string; x: number; y: number }) {
  return (
    <span className="tcg-resolution-value" aria-hidden="true" style={{ left: x, top: y }}>
      {value}
    </span>
  );
}
