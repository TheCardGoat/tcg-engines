import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { maleficentSorceress } from "./049-maleficent-sorceress";

describe("Maleficent - Sorceress", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [maleficentSorceress] });
  //   expect(testEngine.getCardModel(maleficentSorceress).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { maleficentSorceress } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Maleficent - Sorceress", () => {
//   it("**CAST MY SPELL** When you play this character, you may draw a card.", () => {
//     const testStore = new TestStore({
//       inkwell: maleficentSorceress.cost,
//       deck: [youHaveForgottenMe],
//       hand: [maleficentSorceress],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       maleficentSorceress.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack();
//
//     expect(testStore.getZonesCardCount()).toEqual(
//       expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//     );
//   });
// });
//
