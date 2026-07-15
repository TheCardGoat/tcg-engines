// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { balooLaidbackBear } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Baloo - Laid-Back Bear", () => {
//   It("should be a vanilla character with correct stats and no special abilities", () => {
//     Const testEngine = new TestEngine({
//       Play: [balooLaidbackBear],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(balooLaidbackBear);
//
//     // Verify card is in play
//     Expect(cardUnderTest.zone).toBe("play");
//
//     // Verify base stats
//     Expect(cardUnderTest.lorcanitoCard.cost).toBe(2);
//     Expect(cardUnderTest.lorcanitoCard.strength).toBe(2);
//     Expect(cardUnderTest.lorcanitoCard.willpower).toBe(4);
//     Expect(cardUnderTest.lorcanitoCard.lore).toBe(1);
//
//     // Verify characteristics
//     Expect(cardUnderTest.lorcanitoCard.characteristics).toContain("storyborn");
//     Expect(cardUnderTest.lorcanitoCard.characteristics).toContain("ally");
//
//     // Verify color and inkwell
//     Expect(cardUnderTest.lorcanitoCard.colors).toContain("emerald");
//     Expect(cardUnderTest.lorcanitoCard.inkwell).toBe(true);
//
//     // Verify no special abilities
//     Expect(cardUnderTest.lorcanitoCard.abilities).toEqual([]);
//   });
//
//   It("should be able to quest for lore", async () => {
//     Const testEngine = new TestEngine({
//       Play: [balooLaidbackBear],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(balooLaidbackBear);
//
//     Const initialLore = testEngine.store.tableStore.getTable("player_one").lore;
//
//     CardUnderTest.quest();
//
//     Expect(testEngine.store.tableStore.getTable("player_one").lore).toBe(
//       InitialLore + 1,
//     );
//     Expect(cardUnderTest.meta.exerted).toBe(true);
//   });
//
//   It("should be playable from hand with correct ink cost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: balooLaidbackBear.cost,
//       Hand: [balooLaidbackBear],
//     });
//
//     Const cardModel = testEngine.getCardModel(balooLaidbackBear);
//
//     Expect(cardModel.zone).toBe("hand");
//
//     Await testEngine.playCard(balooLaidbackBear);
//
//     Expect(cardModel.zone).toBe("play");
//     Expect(
//       TestEngine.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toBe(0);
//   });
//
//   It("should be able to be used as ink", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [balooLaidbackBear],
//     });
//
//     Const cardModel = testEngine.getCardModel(balooLaidbackBear);
//
//     Expect(cardModel.zone).toBe("hand");
//     Expect(cardModel.lorcanitoCard.inkwell).toBe(true);
//
//     Const initialInkwellSize =
//       TestEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//         .length;
//
//     CardModel.addToInkwell();
//
//     Expect(cardModel.zone).toBe("inkwell");
//     Expect(
//       TestEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//         .length,
//     ).toBe(initialInkwellSize + 1);
//   });
// });
//
