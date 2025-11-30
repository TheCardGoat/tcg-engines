import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { generalLiHeadOfTheImperialArmy } from "./187-general-li-head-of-the-imperial-army";

describe("General Li - Head of the Imperial Army", () => {
  it.skip("should have Resist 1 ability", () => {
    const testEngine = new TestEngine({
      play: [generalLiHeadOfTheImperialArmy],
    });

    const cardUnderTest = testEngine.getCardModel(
      generalLiHeadOfTheImperialArmy,
    );
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
