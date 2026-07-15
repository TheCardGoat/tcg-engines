import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { snowannaRainbeauCoolCompetitor } from "./110-snowanna-rainbeau-cool-competitor";

describe("Snowanna Rainbeau - Cool Competitor", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [snowannaRainbeauCoolCompetitor],
    });

    const cardUnderTest = testEngine.getCardModel(snowannaRainbeauCoolCompetitor);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
