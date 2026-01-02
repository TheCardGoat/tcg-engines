import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { mickeyMouseFoodFightDefender } from "./176-mickey-mouse-food-fight-defender";

describe("Mickey Mouse - Food Fight Defender", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mickeyMouseFoodFightDefender],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseFoodFightDefender);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
