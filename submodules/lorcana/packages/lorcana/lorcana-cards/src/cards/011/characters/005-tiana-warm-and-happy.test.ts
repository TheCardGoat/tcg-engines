import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { tianaWarmAndHappy } from "./005-tiana-warm-and-happy";

describe("Tiana - Warm and Happy", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tianaWarmAndHappy],
    });

    const cardUnderTest = testEngine.getCardModel(tianaWarmAndHappy);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
