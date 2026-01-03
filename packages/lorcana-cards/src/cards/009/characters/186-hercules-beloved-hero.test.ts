import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { herculesBelovedHero } from "./186-hercules-beloved-hero";

describe("Hercules - Beloved Hero", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesBelovedHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesBelovedHero);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesBelovedHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesBelovedHero);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
