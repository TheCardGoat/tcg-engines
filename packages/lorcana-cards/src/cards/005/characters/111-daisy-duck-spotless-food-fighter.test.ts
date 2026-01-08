import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { daisyDuckSpotlessFoodfighter } from "./111-daisy-duck-spotless-food-fighter";

describe("Daisy Duck - Spotless Food-Fighter", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [daisyDuckSpotlessFoodfighter],
    });

    const cardUnderTest = testEngine.getCardModel(daisyDuckSpotlessFoodfighter);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { daisyDuckSpotlessFoodfighter } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Daisy Duck - Spotless Food-Fighter", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: daisyDuckSpotlessFoodfighter.cost,
//       play: [daisyDuckSpotlessFoodfighter],
//     });
//
//     const cardUnderTest = testStore.getCard(daisyDuckSpotlessFoodfighter);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
