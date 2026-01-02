import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { herculesTrueHero } from "./191-hercules-true-hero";

describe("Hercules - True Hero", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesTrueHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesTrueHero);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
