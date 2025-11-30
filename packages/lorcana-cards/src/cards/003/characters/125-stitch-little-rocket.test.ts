import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { stitchLittleRocket } from "./125-stitch-little-rocket";

describe("Stitch - Little Rocket", () => {
  it("should have Rush ability", () => {
    expect(hasRush(stitchLittleRocket)).toBe(true);
  });
});
