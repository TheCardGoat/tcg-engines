// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { juniorWoodchuckGuidebook } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Junior Woodchuck Guidebook", () => {
//   describe.skip("THE BOOK KNOWS EVERYTHING - Activated ability", () => {
//     it("should pay 1 ink and banish this item to draw 2 cards", async () => {
//       const testEngine = new TestEngine({
//         inkwell: juniorWoodchuckGuidebook.cost + 1,
//         play: [juniorWoodchuckGuidebook],
//         deck: 3,
//       });
//
//       const item = testEngine.getCardModel(juniorWoodchuckGuidebook);
//       const initialHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//
//       expect(item.zone).toBe("play");
//       expect(item.ready).toBe(true);
//
//       // Activate the THE BOOK KNOWS EVERYTHING ability
//       await testEngine.activateCard(item, {
//         ability: "The Book Knows Everything",
//       });
//
//       // Item should be banished (cost paid)
//       expect(item.zone).toBe("discard");
//
//       // Should have drawn 2 cards
//       const finalHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//       expect(finalHandSize).toBe(initialHandSize + 2);
//     });
//
//     it("can activate ability but will fail due to insufficient ink during resolution", async () => {
//       const testEngine = new TestEngine({
//         inkwell: juniorWoodchuckGuidebook.cost, // Only enough for the card cost, not the ability
//         play: [juniorWoodchuckGuidebook],
//       });
//
//       const item = testEngine.getCardModel(juniorWoodchuckGuidebook);
//
//       expect(item.zone).toBe("play");
//       expect(item.ready).toBe(true);
//
//       // The activation process starts but should fail during cost payment
//       // Note: The engine's specific behavior for insufficient ink may vary
//       // This test documents the current behavior
//       await testEngine.activateCard(item, {
//         ability: "The Book Knows Everything",
//       });
//
//       // Either the item remains in play (if cost payment failed)
//       // or it's banished but no cards were drawn
//       // The exact behavior depends on engine implementation
//     });
//
//     it("can activate ability even when item is exerted", async () => {
//       const testEngine = new TestEngine({
//         inkwell: juniorWoodchuckGuidebook.cost + 1,
//         play: [juniorWoodchuckGuidebook],
//         deck: 2,
//       });
//
//       const item = testEngine.getCardModel(juniorWoodchuckGuidebook);
//       const initialHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//
//       // Exert the item
//       item.exert();
//
//       expect(item.zone).toBe("play");
//       expect(item.ready).toBe(false);
//
//       // Activate the ability - the engine allows it despite being exerted
//       await testEngine.activateCard(item, {
//         ability: "The Book Knows Everything",
//       });
//
//       // The ability should still work - item banished and cards drawn
//       expect(item.zone).toBe("discard");
//
//       const finalHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//       expect(finalHandSize).toBe(initialHandSize + 2);
//     });
//
//     it("should draw cards even when deck has exactly 2 cards remaining", async () => {
//       const testEngine = new TestEngine({
//         inkwell: juniorWoodchuckGuidebook.cost + 1,
//         play: [juniorWoodchuckGuidebook],
//         deck: 2, // Exactly 2 cards in deck
//       });
//
//       const item = testEngine.getCardModel(juniorWoodchuckGuidebook);
//       const initialHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//
//       // Activate the ability
//       await testEngine.activateCard(item, {
//         ability: "The Book Knows Everything",
//       });
//
//       // Item should be banished
//       expect(item.zone).toBe("discard");
//
//       // Should have drawn all remaining cards (2)
//       const finalHandSize = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "hand",
//       ).length;
//       expect(finalHandSize).toBe(initialHandSize + 2);
//     });
//   });
// });
//
