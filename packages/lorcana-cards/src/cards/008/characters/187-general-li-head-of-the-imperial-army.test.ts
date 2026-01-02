import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { generalLiHeadOfTheImperialArmy } from "./187-general-li-head-of-the-imperial-army";

describe("General Li - Head of the Imperial Army", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [generalLiHeadOfTheImperialArmy],
    });

    const cardUnderTest = testEngine.getCardModel(
      generalLiHeadOfTheImperialArmy,
    );
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
