import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { snowannaRainbeauCoolCompetitor } from "./110-snowanna-rainbeau-cool-competitor";

describe("Snowanna Rainbeau - Cool Competitor", () => {
  it("should have Rush ability", () => {
    expect(hasRush(snowannaRainbeauCoolCompetitor)).toBe(true);
  });
});
