import { describe, expect, it } from "vitest";
import { GRAND_ARCHIVE_ARENA, GRAND_ARCHIVE_CARD_ASPECT } from "./layout";
import { grandArchiveHandHitArea } from "./hit-area";

describe("Grand Archive hand hit area", () => {
  it("keeps taps at least 44 pixels on small landscape phones without enlarging card art", () => {
    for (const [width, height] of [
      [667, 375],
      [844, 390],
      [932, 430],
    ]) {
      for (const scale of [1.3, 1.3 * 1.14]) {
        const hit = grandArchiveHandHitArea(width!, height!, scale, GRAND_ARCHIVE_CARD_ASPECT);
        const visibleHeight = Math.max(
          GRAND_ARCHIVE_ARENA.height,
          (GRAND_ARCHIVE_ARENA.width * height!) / width!,
        );
        const pixelsPerLocalUnit = (height! / visibleHeight) * scale;
        expect(hit.width * pixelsPerLocalUnit).toBeGreaterThanOrEqual(44 - 0.0001);
        expect(hit.height * pixelsPerLocalUnit).toBeGreaterThanOrEqual(44 - 0.0001);
        expect(hit.width).toBeGreaterThanOrEqual(1);
        expect(hit.height).toBeGreaterThanOrEqual(1 / GRAND_ARCHIVE_CARD_ASPECT);
      }
    }
    expect(grandArchiveHandHitArea(667, 375, 1.3, GRAND_ARCHIVE_CARD_ASPECT).width).toBeGreaterThan(
      1,
    );
  });

  it("uses the original card bounds when the art is already larger than the tap minimum", () => {
    expect(grandArchiveHandHitArea(1440, 900, 1.3, GRAND_ARCHIVE_CARD_ASPECT)).toEqual({
      width: 1,
      height: 1 / GRAND_ARCHIVE_CARD_ASPECT,
    });
  });
});
