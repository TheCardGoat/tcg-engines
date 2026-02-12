import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { theQueenWickedAndVain } from "./056-the-queen-wicked-and-vain";

describe("The Queen - Wicked and Vain", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [theQueenWickedAndVain] });
  //   Expect(testEngine.getCardModel(theQueenWickedAndVain).hasKeyword()).toBe(true);
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
// Import { theQueenWickedAndVain } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Queen - Wicked and Vain", () => {
//   It("**I SUMMON THEE** {E} − Draw a card.", () => {
//     Const testStore = new TestStore({
//       Deck: [youHaveForgottenMe],
//       Play: [theQueenWickedAndVain],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TheQueenWickedAndVain.id,
//     );
//
//     CardUnderTest.activate();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//     );
//   });
// });
//
