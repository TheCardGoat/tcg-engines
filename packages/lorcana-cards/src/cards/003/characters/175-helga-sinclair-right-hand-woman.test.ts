import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { helgaSinclairRighthandWoman } from "./175-helga-sinclair-right-hand-woman";

describe("Helga Sinclair - Right-Hand Woman", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [helgaSinclairRighthandWoman],
    });

    const cardUnderTest = testEngine.getCardModel(helgaSinclairRighthandWoman);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
