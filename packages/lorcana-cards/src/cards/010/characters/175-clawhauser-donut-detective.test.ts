import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { clawhauserDonutDetective } from "./175-clawhauser-donut-detective";

describe("Clawhauser - Donut Detective", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [clawhauserDonutDetective],
      },
    );

    const cardUnderTest = testEngine.getCardModel(clawhauserDonutDetective);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
