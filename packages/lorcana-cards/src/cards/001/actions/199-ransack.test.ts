import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { ransack } from "./199-ransack";

describe("ransack - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [ransack] });
  //   Expect(testEngine.getCardModel(ransack).hasKeyword()).toBe(true);
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
//   Ransack,
//   YouHaveForgottenMe,
// } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   AladdinHeroicOutlaw,
//   MagicBroomBucketBrigade,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ransack", () => {
//   It("draw 2 cards and discard 2 cards", () => {
//     Const testStore = new TestStore({
//       Inkwell: ransack.cost,
//       Deck: [magicBroomBucketBrigade, youHaveForgottenMe],
//       Hand: [ransack, aladdinHeroicOutlaw],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ransack.id);
//
//     Const aCardToDiscard = testStore.getByZoneAndId(
//       "hand",
//       AladdinHeroicOutlaw.id,
//     );
//     // This card will be drawn, then discarded.
//     Const anotherCardToDiscard = testStore.getByZoneAndId(
//       "deck",
//       YouHaveForgottenMe.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({
//       Targets: [aCardToDiscard, anotherCardToDiscard],
//     });
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, play: 0, discard: 2 + 1 }),
//     );
//   });
//
//   It("you should draw before discarding", () => {
//     Const testStore = new TestStore({
//       Inkwell: ransack.cost,
//       Deck: [magicBroomBucketBrigade, youHaveForgottenMe],
//       Hand: [ransack, aladdinHeroicOutlaw],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ransack.id);
//
//     Const aCardToDiscard = testStore.getByZoneAndId(
//       "hand",
//       AladdinHeroicOutlaw.id,
//     );
//
//     Const anotherCardToDiscard = testStore.getByZoneAndId(
//       "deck",
//       YouHaveForgottenMe.id,
//     );
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 3, deck: 0, discard: 1 }),
//     );
//     TestStore.resolveTopOfStack({
//       Targets: [aCardToDiscard, anotherCardToDiscard],
//     });
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 3 }),
//     );
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
