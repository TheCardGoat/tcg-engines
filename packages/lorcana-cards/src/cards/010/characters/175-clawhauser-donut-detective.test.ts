import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { clawhauserDonutDetective } from "./175-clawhauser-donut-detective";

describe("Clawhauser - Donut Detective", () => {
  it.skip("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [clawhauserDonutDetective],
    });

    const cardUnderTest = testEngine.getCardModel(clawhauserDonutDetective);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
