import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { helgaSinclairRighthandWoman } from "./175-helga-sinclair-right-hand-woman";

describe("Helga Sinclair - Right-Hand Woman", () => {
  it.skip("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [helgaSinclairRighthandWoman],
    });

    const cardUnderTest = testEngine.getCardModel(helgaSinclairRighthandWoman);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
