import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { daisyDuckSpotlessFoodfighter } from "./111-daisy-duck-spotless-food-fighter";

describe("Daisy Duck - Spotless Food-Fighter", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(daisyDuckSpotlessFoodfighter)).toBe(true);
  });
});
