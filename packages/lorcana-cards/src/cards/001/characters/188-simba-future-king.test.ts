import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { simbaFutureKing } from "./188-simba-future-king";

describe("Simba - Future King", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [simbaFutureKing] });
  //   Expect(testEngine.getCardModel(simbaFutureKing).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MagicBroomBucketBrigade,
//   SimbaFutureKing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Simba - Future King", () => {
//   Describe("**GUESS WHAT?** When you play this character, you may draw a card, then choose and discard a card.", () => {
//     It("Happy path", () => {
//       Const testStore = new TestStore({
//         Inkwell: simbaFutureKing.cost,
//         Deck: [magicBroomBucketBrigade],
//         Hand: [simbaFutureKing],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         SimbaFutureKing.id,
//       );
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.stackLayers).toHaveLength(1);
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.stackLayers).toHaveLength(1);
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//       );
//
//       Const aCardToDiscard = testStore.getByZoneAndId(
//         "hand",
//         MagicBroomBucketBrigade.id,
//       );
//       TestStore.resolveTopOfStack({
//         Targets: [aCardToDiscard],
//       });
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 0, deck: 0, play: 1, discard: 1 }),
//       );
//     });
//
//     // it.todo("should not let people skip the discard");
//   });
// });
//
