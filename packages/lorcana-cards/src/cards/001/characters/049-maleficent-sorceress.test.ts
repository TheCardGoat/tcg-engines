import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { maleficentSorceress } from "./049-maleficent-sorceress";

describe("Maleficent - Sorceress", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [maleficentSorceress] });
  //   Expect(testEngine.getCardModel(maleficentSorceress).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { maleficentSorceress } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maleficent - Sorceress", () => {
//   It("**CAST MY SPELL** When you play this character, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: maleficentSorceress.cost,
//       Deck: [youHaveForgottenMe],
//       Hand: [maleficentSorceress],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MaleficentSorceress.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//     );
//   });
// });
//
