import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { mickeyMouseFoodFightDefender } from "./176-mickey-mouse-food-fight-defender";

describe("Mickey Mouse - Food Fight Defender", () => {
  it.skip("should have Resist 1 ability", () => {
    const testEngine = new TestEngine({
      play: [mickeyMouseFoodFightDefender],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseFoodFightDefender);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
