import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { theQueenWickedAndVain } from "./056-the-queen-wicked-and-vain";

describe("The Queen - Wicked and Vain", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [theQueenWickedAndVain] });
  //   expect(testEngine.getCardModel(theQueenWickedAndVain).hasKeyword()).toBe(true);
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
// import { theQueenWickedAndVain } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("The Queen - Wicked and Vain", () => {
//   it("**I SUMMON THEE** {E} − Draw a card.", () => {
//     const testStore = new TestStore({
//       deck: [youHaveForgottenMe],
//       play: [theQueenWickedAndVain],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       theQueenWickedAndVain.id,
//     );
//
//     cardUnderTest.activate();
//
//     expect(testStore.getZonesCardCount()).toEqual(
//       expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//     );
//   });
// });
//
