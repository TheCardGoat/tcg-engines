import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { helgaSinclairRighthandWoman } from "./175-helga-sinclair-right-hand-woman";

describe("Helga Sinclair - Right-Hand Woman", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [helgaSinclairRighthandWoman],
    });
    const cardUnderTest = testEngine.getCardModel(helgaSinclairRighthandWoman);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
