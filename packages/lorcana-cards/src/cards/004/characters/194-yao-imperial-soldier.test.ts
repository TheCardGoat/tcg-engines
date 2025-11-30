import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { yaoImperialSoldier } from "./194-yao-imperial-soldier";

describe("Yao - Imperial Soldier", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [yaoImperialSoldier],
    });
    const cardUnderTest = testEngine.getCardModel(yaoImperialSoldier);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
