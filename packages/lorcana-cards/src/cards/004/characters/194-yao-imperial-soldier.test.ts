import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { yaoImperialSoldier } from "./194-yao-imperial-soldier";

describe("Yao - Imperial Soldier", () => {
  it.skip("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [yaoImperialSoldier],
    });

    const cardUnderTest = testEngine.getCardModel(yaoImperialSoldier);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
