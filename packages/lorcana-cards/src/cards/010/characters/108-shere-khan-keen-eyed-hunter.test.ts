// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { shereKhanKeeneyedHunter } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Shere Khan - Keen-Eyed Hunter", () => {
//   it("should be a vanilla character with correct stats and no special abilities", () => {
//     const testEngine = new TestEngine({
//       play: [shereKhanKeeneyedHunter],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(shereKhanKeeneyedHunter);
//
//     // Verify card is in play
//     expect(cardUnderTest.zone).toBe("play");
//
//     // Verify base stats
//     expect(cardUnderTest.lorcanitoCard.cost).toBe(2);
//     expect(cardUnderTest.lorcanitoCard.strength).toBe(3);
//     expect(cardUnderTest.lorcanitoCard.willpower).toBe(3);
//     expect(cardUnderTest.lorcanitoCard.lore).toBe(1);
//
//     // Verify characteristics
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("storyborn");
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("villain");
//
//     // Verify color and inkwell
//     expect(cardUnderTest.lorcanitoCard.colors).toContain("ruby");
//     expect(cardUnderTest.lorcanitoCard.inkwell).toBe(true);
//
//     // Verify no special abilities
//     expect(cardUnderTest.lorcanitoCard.abilities).toEqual([]);
//   });
//
//   it("should be able to quest for lore", async () => {
//     const testEngine = new TestEngine({
//       play: [shereKhanKeeneyedHunter],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(shereKhanKeeneyedHunter);
//
//     const initialLore = testEngine.store.tableStore.getTable("player_one").lore;
//
//     cardUnderTest.quest();
//
//     expect(testEngine.store.tableStore.getTable("player_one").lore).toBe(
//       initialLore + 1,
//     );
//     expect(cardUnderTest.meta.exerted).toBe(true);
//   });
//
//   it("should be playable from hand with correct ink cost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: shereKhanKeeneyedHunter.cost,
//       hand: [shereKhanKeeneyedHunter],
//     });
//
//     const cardModel = testEngine.getCardModel(shereKhanKeeneyedHunter);
//
//     expect(cardModel.zone).toBe("hand");
//
//     await testEngine.playCard(shereKhanKeeneyedHunter);
//
//     expect(cardModel.zone).toBe("play");
//     expect(
//       testEngine.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toBe(0);
//   });
//
//   it("should be able to be used as ink", async () => {
//     const testEngine = new TestEngine({
//       hand: [shereKhanKeeneyedHunter],
//     });
//
//     const cardModel = testEngine.getCardModel(shereKhanKeeneyedHunter);
//
//     expect(cardModel.zone).toBe("hand");
//     expect(cardModel.lorcanitoCard.inkwell).toBe(true);
//
//     const initialInkwellSize =
//       testEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//         .length;
//
//     cardModel.addToInkwell();
//
//     expect(cardModel.zone).toBe("inkwell");
//     expect(
//       testEngine.store.tableStore.getTable("player_one").zones.inkwell.cards
//         .length,
//     ).toBe(initialInkwellSize + 1);
//   });
// });
//
