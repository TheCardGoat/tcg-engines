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

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { violetSabrewingSeniorJuniorWoodchuck } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Violet Sabrewing - Senior Junior Woodchuck", () => {
//   it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [violetSabrewingSeniorJuniorWoodchuck],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       violetSabrewingSeniorJuniorWoodchuck,
//     );
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
