import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { rafikiMysteriousSage } from "./054-rafiki-mysterious-sage";

describe("Rafiki - Mysterious Sage", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rafikiMysteriousSage],
    });

    const cardUnderTest = testEngine.getCardModel(rafikiMysteriousSage);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
