import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { RafikiMysteriousSage } from "./054-rafiki-mysterious-sage";

describe("Rafiki - Mysterious Sage", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [RafikiMysteriousSage],
    });

    const cardUnderTest = testEngine.getCardModel(RafikiMysteriousSage);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
