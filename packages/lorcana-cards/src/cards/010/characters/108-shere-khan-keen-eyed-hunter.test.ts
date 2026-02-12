// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { shereKhanKeeneyedHunter } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Shere Khan - Keen-Eyed Hunter", () => {
//   It("should be a vanilla character with correct stats and no special abilities", () => {
//     Const testEngine = new TestEngine({
//       Play: [shereKhanKeeneyedHunter],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(shereKhanKeeneyedHunter);
//
//     // Verify card is in play
//     Expect(cardUnderTest.zone).toBe("play");
//
//     // Verify base stats
//     Expect(cardUnderTest.lorcanitoCard.cost).toBe(2);
//     Expect(cardUnderTest.lorcanitoCard.strength).toBe(3);
//     Expect(cardUnderTest.lorcanitoCard.willpower).toBe(3);
//     Expect(cardUnderTest.lorcanitoCard.lore).toBe(1);
//
//     // Verify characteristics
//     Expect(cardUnderTest.lorcanitoCard.characteristics).toContain("storyborn");
//     Expect(cardUnderTest.lorcanitoCard.characteristics).toContain("villain");
//
//     // Verify color and inkwell
//     Expect(cardUnderTest.lorcanitoCard.colors).toContain("ruby");
//     Expect(cardUnderTest.lorcanitoCard.inkwell).toBe(true);
//
//     // Verify no special abilities
//     Expect(cardUnderTest.lorcanitoCard.abilities).toEqual([]);
//   });
//
//   It("should be able to quest for lore", async () => {
//     Const testEngine = new TestEngine({
//       Play: [shereKhanKeeneyedHunter],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(shereKhanKeeneyedHunter);
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
//       Inkwell: shereKhanKeeneyedHunter.cost,
//       Hand: [shereKhanKeeneyedHunter],
//     });
//
//     Const cardModel = testEngine.getCardModel(shereKhanKeeneyedHunter);
//
//     Expect(cardModel.zone).toBe("hand");
//
//     Await testEngine.playCard(shereKhanKeeneyedHunter);
//
//     Expect(cardModel.zone).toBe("play");
//     Expect(
//       TestEngine.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toBe(0);
//   });
//
//   It("should be able to be used as ink", async () => {
//     Const testEngine = new TestEngine({
//       Hand: [shereKhanKeeneyedHunter],
//     });
//
//     Const cardModel = testEngine.getCardModel(shereKhanKeeneyedHunter);
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
