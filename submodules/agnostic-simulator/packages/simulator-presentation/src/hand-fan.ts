import type { DomCardPose } from "./DomCardMotion";

/** Stable hand geometry. Inspection never changes the hit regions or neighbouring cards. */
export function handFanLayout(width: number, height: number, count: number) {
  const cardWidth = Math.min(126, height * 0.24, Math.max(64, width * 0.17));
  const cardHeight = cardWidth * 1.4;
  const span = Math.max(0, Math.min(width - cardWidth - 36, cardWidth * 0.64 * (count - 1)));
  const step = count > 1 ? span / (count - 1) : 0;
  const first = width / 2 - span / 2;
  const top = height - cardHeight * 0.72;
  const pose = (index: number, inspected = false): DomCardPose => {
    const offset = count > 1 ? (index - (count - 1) / 2) / ((count - 1) / 2) : 0;
    const w = inspected ? Math.min(210, width - 32, height * 0.53) : cardWidth;
    const h = w * 1.4;
    const center = first + index * step;
    return {
      left: Math.max(12, Math.min(width - w - 12, center - w / 2)),
      top: inspected ? height - h - 18 : top + offset * offset * Math.min(25, count * 3),
      width: w,
      height: h,
      rotation: inspected ? 0 : offset * Math.min(0.17, (count - 1) * 0.028),
      face: true,
    };
  };
  const hit = (x: number, y: number, active: number | null): number | null => {
    if (!count || x < first - cardWidth / 2 || x > first + span + cardWidth / 2 || y > height)
      return null;
    // Keep an inspected card open while crossing from its resting fan into its raised face.
    const threshold = active === null ? top - 12 : pose(active, true).top;
    if (y < threshold) return null;
    if (active !== null && y < top - 12) {
      const raised = pose(active, true);
      return x >= raised.left && x <= raised.left + raised.width ? active : null;
    }
    return Math.max(0, Math.min(count - 1, step ? Math.round((x - first) / step) : 0));
  };
  return { pose, hit };
}

/** Centered tabletop fan, shared by game boards. Rotation is in degrees. */
export function tabletopFanSlot(
  index: number,
  count: number,
  width: number,
  span: number,
  drop = 42,
  rotation = 11,
  pitch = 0.72,
) {
  const offset = index - (count - 1) / 2;
  const swing = offset / Math.max(1, (count - 1) / 2);
  const step = Math.min(width * pitch, Math.max(0, span - width) / Math.max(1, count - 1));
  return { x: offset * step, drop: swing * swing * drop, angle: swing * rotation };
}
