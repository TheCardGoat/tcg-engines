export interface GuideBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

interface TargetBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/** Mobile guide block. Tall enough for the step copy, short enough to leave the other rail clear. */
export function mobileGuideHeight(viewportHeight: number): number {
  return Math.min(Math.round(viewportHeight * 0.34), 280);
}

/**
 * Keep the highlight on the control. A bottom-rail button must not be clipped
 * out of the viewport, or the spotlight height collapses to zero.
 */
export function spotlightFrame(
  boxes: readonly TargetBox[],
  viewport: ViewportSize,
): GuideBox | null {
  if (boxes.length === 0) return null;
  const padding = 6;
  const left = Math.max(0, Math.min(...boxes.map((box) => box.left)) - padding);
  const top = Math.max(0, Math.min(...boxes.map((box) => box.top)) - padding);
  const right = Math.min(viewport.width, Math.max(...boxes.map((box) => box.right)) + padding);
  const bottom = Math.min(viewport.height, Math.max(...boxes.map((box) => box.bottom)) + padding);
  const width = right - left;
  const height = bottom - top;
  if (width <= 0 || height <= 0) return null;
  return { top, left, width, height };
}

export type GuideAnchor = "top" | "bottom";

/** Park the guide on the edge that does not cover the highlight. */
export function guideAnchorForHighlight(highlight: GuideBox, viewportHeight: number): GuideAnchor {
  const guideHeight = mobileGuideHeight(viewportHeight);
  const highlightBottom = highlight.top + highlight.height;
  const overlaps = (dockTop: number, dockBottom: number) =>
    highlight.top < dockBottom && highlightBottom > dockTop;
  const topOverlaps = overlaps(8, 8 + guideHeight);
  const bottomDockTop = viewportHeight - guideHeight - 8;
  const bottomOverlaps = overlaps(bottomDockTop, viewportHeight - 8);
  if (!topOverlaps) return "top";
  if (!bottomOverlaps) return "bottom";
  return highlight.top < viewportHeight / 2 ? "bottom" : "top";
}

export function mobileGuideFrame(anchor: GuideAnchor, viewport: ViewportSize): GuideBox {
  const height = mobileGuideHeight(viewport.height);
  const width = Math.max(0, viewport.width - 16);
  const top = anchor === "bottom" ? Math.max(8, viewport.height - height - 8) : 8;
  return { top, left: 8, width, height };
}
