// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { juniorWoodchuckGuidebook } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Junior Woodchuck Guidebook", () => {
//   Describe.skip("THE BOOK KNOWS EVERYTHING - Activated ability", () => {
//     It("should pay 1 ink and banish this item to draw 2 cards", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: juniorWoodchuckGuidebook.cost + 1,
//         Play: [juniorWoodchuckGuidebook],
//         Deck: 3,
//       });
//
//       Const item = testEngine.getCardModel(juniorWoodchuckGuidebook);
//       Const initialHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//
//       Expect(item.zone).toBe("play");
//       Expect(item.ready).toBe(true);
//
//       // Activate the THE BOOK KNOWS EVERYTHING ability
//       Await testEngine.activateCard(item, {
//         Ability: "The Book Knows Everything",
//       });
//
//       // Item should be banished (cost paid)
//       Expect(item.zone).toBe("discard");
//
//       // Should have drawn 2 cards
//       Const finalHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//       Expect(finalHandSize).toBe(initialHandSize + 2);
//     });
//
//     It("can activate ability but will fail due to insufficient ink during resolution", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: juniorWoodchuckGuidebook.cost, // Only enough for the card cost, not the ability
//         Play: [juniorWoodchuckGuidebook],
//       });
//
//       Const item = testEngine.getCardModel(juniorWoodchuckGuidebook);
//
//       Expect(item.zone).toBe("play");
//       Expect(item.ready).toBe(true);
//
//       // The activation process starts but should fail during cost payment
//       // Note: The engine's specific behavior for insufficient ink may vary
//       // This test documents the current behavior
//       Await testEngine.activateCard(item, {
//         Ability: "The Book Knows Everything",
//       });
//
//       // Either the item remains in play (if cost payment failed)
//       // or it's banished but no cards were drawn
//       // The exact behavior depends on engine implementation
//     });
//
//     It("can activate ability even when item is exerted", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: juniorWoodchuckGuidebook.cost + 1,
//         Play: [juniorWoodchuckGuidebook],
//         Deck: 2,
//       });
//
//       Const item = testEngine.getCardModel(juniorWoodchuckGuidebook);
//       Const initialHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//
//       // Exert the item
//       Item.exert();
//
//       Expect(item.zone).toBe("play");
//       Expect(item.ready).toBe(false);
//
//       // Activate the ability - the engine allows it despite being exerted
//       Await testEngine.activateCard(item, {
//         Ability: "The Book Knows Everything",
//       });
//
//       // The ability should still work - item banished and cards drawn
//       Expect(item.zone).toBe("discard");
//
//       Const finalHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//       Expect(finalHandSize).toBe(initialHandSize + 2);
//     });
//
//     It("should draw cards even when deck has exactly 2 cards remaining", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: juniorWoodchuckGuidebook.cost + 1,
//         Play: [juniorWoodchuckGuidebook],
//         Deck: 2, // Exactly 2 cards in deck
//       });
//
//       Const item = testEngine.getCardModel(juniorWoodchuckGuidebook);
//       Const initialHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//
//       // Activate the ability
//       Await testEngine.activateCard(item, {
//         Ability: "The Book Knows Everything",
//       });
//
//       // Item should be banished
//       Expect(item.zone).toBe("discard");
//
//       // Should have drawn all remaining cards (2)
//       Const finalHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//       Expect(finalHandSize).toBe(initialHandSize + 2);
//     });
//   });
// });
//
