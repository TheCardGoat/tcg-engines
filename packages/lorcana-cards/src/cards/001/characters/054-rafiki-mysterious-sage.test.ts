import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { rafikimysteriousSage } from "./054-rafiki-mysterious-sage";

describe("Rafiki - Mysterious Sage", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rafikimysteriousSage],
    });

    const cardUnderTest = testEngine.getCardModel(rafikimysteriousSage);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
