import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
} from "react";
import { createPortal } from "react-dom";

/** Screen-space ordering shared by DOM overlays and Three.js board adapters. */
export const CARD_PRESENTATION_LAYERS = {
  board: 0,
  motion: 1000,
  focus: 5500,
} as const;

export interface CardPresentationPlaneProps extends HTMLAttributes<HTMLDivElement> {
  readonly layer?: keyof typeof CARD_PRESENTATION_LAYERS;
  readonly ref?: Ref<HTMLDivElement>;
  /** Escape board stacking contexts while keeping board-relative coordinates. */
  readonly portal?: boolean;
}

/** Keep this outside the board's perspective transform. Targets remain clickable below it. */
export function CardPresentationPlane({
  layer = "focus",
  ref,
  style,
  portal = false,
  ...props
}: CardPresentationPlaneProps) {
  const origin = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<Pick<DOMRect, "left" | "top" | "width" | "height"> | null>(
    null,
  );
  useLayoutEffect(() => {
    if (!portal || !origin.current) return;
    const node = origin.current;
    const update = () => {
      const { left, top, width, height } = node.getBoundingClientRect();
      setBounds((old) =>
        old && old.left === left && old.top === top && old.width === width && old.height === height
          ? old
          : { left, top, width, height },
      );
    };
    update();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(node);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [portal]);
  const planeStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    ...style,
    zIndex: CARD_PRESENTATION_LAYERS[layer],
    ...(portal && bounds ? { position: "fixed", inset: "auto", ...bounds } : {}),
  };
  const plane = (
    <div {...props} ref={ref} data-card-presentation-layer={layer} style={planeStyle} />
  );
  if (!portal) return plane;
  return (
    <>
      <div
        ref={origin}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        aria-hidden="true"
      />
      {bounds && createPortal(plane, document.body)}
    </>
  );
}
