import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { MaximusPalaceHorse } from "./010-maximus-palace-horse";

describe("Maximus - Palace Horse", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [MaximusPalaceHorse],
    });

    const cardUnderTest = testEngine.getCardModel(MaximusPalaceHorse);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [MaximusPalaceHorse],
    });

    const cardUnderTest = testEngine.getCardModel(MaximusPalaceHorse);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
