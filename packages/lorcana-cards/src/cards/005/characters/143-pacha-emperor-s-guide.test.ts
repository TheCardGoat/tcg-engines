// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { pachaEmperorsGuide } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { rapunzelsTowerSecludedPrison } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pacha - Emperor's Guide", () => {
//   It("**HELPFUL SUPPLIES** At the start of your turn, if you have an item in play, gain 1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: pachaEmperorsGuide.cost,
//       Play: [pachaEmperorsGuide, dingleHopper],
//     });
//
//     TestStore.passTurn();
//     Expect(testStore.store.turnCount).toBe(1);
//     TestStore.passTurn();
//     TestStore.resolveTopOfStack({}, true);
//     TestStore.resolveTopOfStack({}, true);
//     Expect(testStore.store.turnCount).toBe(2);
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//     Expect(testStore.getPlayerLore()).toBe(1);
//   });
//
//   It("**PERFECT DIRECTIONS** At the start of your turn, if you have a location in play, gain 1 lore.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [pachaEmperorsGuide, rapunzelsTowerSecludedPrison],
//         Deck: 2,
//       },
//       { deck: 2 },
//     );
//
//     TestStore.passTurn();
//     Expect(testStore.store.turnCount).toBe(1);
//     TestStore.passTurn();
//     Expect(testStore.store.turnCount).toBe(2);
//     TestStore.resolveTopOfStack({}, true);
//     TestStore.resolveTopOfStack({}, true);
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//     Expect(testStore.getPlayerLore()).toBe(1);
//   });
//
//   It("Having both", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [pachaEmperorsGuide, rapunzelsTowerSecludedPrison, dingleHopper],
//         Deck: 2,
//       },
//       { deck: 2 },
//     );
//
//     TestStore.passTurn();
//     Expect(testStore.store.turnCount).toBe(1);
//     TestStore.passTurn();
//     TestStore.resolveTopOfStack({}, true);
//     TestStore.resolveTopOfStack({}, true);
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//     Expect(testStore.store.turnCount).toBe(2);
//     Expect(testStore.getPlayerLore()).toBe(2);
//   });
//
//   It("Having none", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [pachaEmperorsGuide],
//         Deck: 2,
//       },
//       { deck: 2 },
//     );
//
//     TestStore.passTurn();
//     Expect(testStore.store.turnCount).toBe(1);
//     TestStore.passTurn();
//     Expect(testStore.store.turnCount).toBe(2);
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//     Expect(testStore.getPlayerLore()).toBe(0);
//   });
// });
//
// Describe("Regression", () => {
//   It("should let opponent pass turn when there's no valid target", () => {
//     Const testStore = new TestStore(
//       { deck: 2 },
//       {
//         Play: [pachaEmperorsGuide],
//         Deck: 2,
//       },
//     );
//
//     Const moveResponse = testStore.passTurn();
//     Expect(moveResponse.success).toBe(true);
//     Expect(testStore.store.turnCount).toBe(1);
//
//     Const secondMoveResponse = testStore.passTurn();
//     Expect(secondMoveResponse.success).toBe(true);
//     Expect(testStore.store.turnCount).toBe(2);
//
//     Expect(testStore.stackLayers).toHaveLength(0);
//     Expect(testStore.getPlayerLore()).toBe(0);
//   });
// });
//
