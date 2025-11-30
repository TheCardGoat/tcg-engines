import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { violetSabrewingSeniorJuniorWoodchuck } from "./044-violet-sabrewing-senior-junior-woodchuck";

describe("Violet Sabrewing - Senior Junior Woodchuck", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [violetSabrewingSeniorJuniorWoodchuck],
    });

    const cardUnderTest = testEngine.getCardModel(
      violetSabrewingSeniorJuniorWoodchuck,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
