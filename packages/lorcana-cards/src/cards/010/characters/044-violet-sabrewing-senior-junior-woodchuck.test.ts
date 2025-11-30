import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { violetSabrewingSeniorJuniorWoodchuck } from "./044-violet-sabrewing-senior-junior-woodchuck";

describe("Violet Sabrewing - Senior Junior Woodchuck", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [violetSabrewingSeniorJuniorWoodchuck],
    });
    const cardUnderTest = testEngine.getCardModel(
      violetSabrewingSeniorJuniorWoodchuck,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
