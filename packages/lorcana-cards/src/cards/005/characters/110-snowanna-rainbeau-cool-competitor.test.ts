import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { snowannaRainbeauCoolCompetitor } from "./110-snowanna-rainbeau-cool-competitor";

describe("Snowanna Rainbeau - Cool Competitor", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [snowannaRainbeauCoolCompetitor],
    });
    const cardUnderTest = testEngine.getCardModel(
      snowannaRainbeauCoolCompetitor,
    );
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
