import { GRAND_ARCHIVE_ARENA } from "./layout";

/** Local card-space dimensions. The art keeps its size and aspect ratio. */
export function grandArchiveHandHitArea(
  viewportWidth: number,
  viewportHeight: number,
  scale: number,
  aspect: number,
) {
  const pixelWidth = Math.max(1, viewportWidth);
  const pixelHeight = Math.max(1, viewportHeight);
  const visibleHeight = Math.max(
    GRAND_ARCHIVE_ARENA.height,
    (GRAND_ARCHIVE_ARENA.width * pixelHeight) / pixelWidth,
  );
  const pixelsPerLocalUnit = (pixelHeight / visibleHeight) * scale;
  const minimum = 44 / pixelsPerLocalUnit;
  return { width: Math.max(1, minimum), height: Math.max(1 / aspect, minimum) };
}
