import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { maximusPalaceHorse } from "./010-maximus-palace-horse";

describe("Maximus - Palace Horse", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [maximusPalaceHorse],
    });

    const cardUnderTest = testEngine.getCardModel(maximusPalaceHorse);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [maximusPalaceHorse],
    });

    const cardUnderTest = testEngine.getCardModel(maximusPalaceHorse);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
