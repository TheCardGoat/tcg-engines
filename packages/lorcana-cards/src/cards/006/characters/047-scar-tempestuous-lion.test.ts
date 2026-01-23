import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { scarTempestuousLion } from "./047-scar-tempestuous-lion";

describe("Scar - Tempestuous Lion", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [scarTempestuousLion],
    });

    const cardUnderTest = testEngine.getCardModel(scarTempestuousLion);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [scarTempestuousLion],
    });

    const cardUnderTest = testEngine.getCardModel(scarTempestuousLion);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { scarTempestuousLion } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Scar - Tempestuous Lion", () => {
//   it.skip("Rush (This character can challenge the turn they're played.)", async () => {
//     const testEngine = new TestEngine({
//       play: [scarTempestuousLion],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(scarTempestuousLion);
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   it.skip("Challenger +3 (While challenging, this character gets +3 {S}.)", async () => {
//     const testEngine = new TestEngine({
//       play: [scarTempestuousLion],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(scarTempestuousLion);
//     expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
