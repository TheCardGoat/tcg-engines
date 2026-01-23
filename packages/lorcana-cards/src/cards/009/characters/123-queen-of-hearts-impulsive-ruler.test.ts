import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { queenOfHeartsImpulsiveRuler } from "./123-queen-of-hearts-impulsive-ruler";

describe("Queen of Hearts - Impulsive Ruler", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [queenOfHeartsImpulsiveRuler],
    });

    const cardUnderTest = testEngine.getCardModel(queenOfHeartsImpulsiveRuler);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { queenOfHeartsImpulsiveRuler } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Queen of Hearts - Impulsive Ruler", () => {
//   it.skip("**Rush** _(This character can challenge the turn they're played.)_", async () => {
//     const testEngine = new TestEngine({
//       play: [queenOfHeartsImpulsiveRuler],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(queenOfHeartsImpulsiveRuler);
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
