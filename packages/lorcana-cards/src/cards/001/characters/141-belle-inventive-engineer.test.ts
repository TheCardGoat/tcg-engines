import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { belleInventiveEngineer } from "./141-belle-inventive-engineer";

describe("Belle - Inventive Engineer", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [belleInventiveEngineer] });
  //   Expect(testEngine.getCardModel(belleInventiveEngineer).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { belleInventive } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { lantern } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Belle - Inventive Engineer", () => {
//   It("**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: lantern.cost - 1,
//       Hand: [lantern],
//       Play: [belleInventive],
//     });
//
//     Const reducedCostItem = testStore.getByZoneAndId("hand", lantern.id);
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", belleInventive.id);
//     CardUnderTest.quest();
//
//     ReducedCostItem.playFromHand();
//
//     Expect(testStore.store.tableStore.getTable().inkAvailable()).toEqual(0);
//     Expect(reducedCostItem.zone).toEqual("play");
//   });
// });
//
