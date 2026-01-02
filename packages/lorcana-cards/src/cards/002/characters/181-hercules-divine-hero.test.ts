import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { herculesDivineHero } from "./181-hercules-divine-hero";

describe("Hercules - Divine Hero", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesDivineHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesDivineHero);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Resist 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesDivineHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesDivineHero);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
