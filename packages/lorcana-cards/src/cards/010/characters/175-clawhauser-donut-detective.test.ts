import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { clawhauserDonutDetective } from "./175-clawhauser-donut-detective";

describe("Clawhauser - Donut Detective", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [clawhauserDonutDetective],
    });
    const cardUnderTest = testEngine.getCardModel(clawhauserDonutDetective);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
