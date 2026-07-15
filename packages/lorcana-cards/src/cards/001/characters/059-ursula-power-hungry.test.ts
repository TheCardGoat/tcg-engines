import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { ursulaPowerHungry } from "./059-ursula-power-hungry";

describe("Ursula - Power Hungry", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [ursulaPowerHungry] });
  //   Expect(testEngine.getCardModel(ursulaPowerHungry).hasKeyword()).toBe(true);
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
// Import { ursulaPowerHungry } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula - Power Hungry", () => {
//   Describe("**IT'S TOO EASY!** When you play this character, each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.", () => {
//     It("Activates the effect", () => {
//       Const testStore = new TestStore({
//         Inkwell: ursulaPowerHungry.cost,
//         Deck: [youHaveForgottenMe],
//         Hand: [ursulaPowerHungry],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         UrsulaPowerHungry.id,
//       );
//
//       TestStore.store.tableStore.getTable("player_two").lore = 5;
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//       );
//     });
//
//     It.skip("Skips the effect", () => {
//       Const testStore = new TestStore({
//         Inkwell: ursulaPowerHungry.cost,
//         Deck: [youHaveForgottenMe],
//         Hand: [ursulaPowerHungry],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         UrsulaPowerHungry.id,
//       );
//
//       TestStore.store.tableStore.getTable("player_two").lore = 5;
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack();
//
//       Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 0, deck: 1, play: 1, discard: 0 }),
//       );
//     });
//   });
// });
//
