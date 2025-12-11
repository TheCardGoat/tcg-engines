import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { mufasaAmongTheStars } from "./079-mufasa-among-the-stars";

describe("Mufasa - Among the Stars", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mufasaAmongTheStars],
    });

    const cardUnderTest = testEngine.getCardModel(mufasaAmongTheStars);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mufasaAmongTheStars],
    });

    const cardUnderTest = testEngine.getCardModel(mufasaAmongTheStars);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mufasaAmongTheStars],
    });

    const cardUnderTest = testEngine.getCardModel(mufasaAmongTheStars);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
