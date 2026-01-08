// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { chefLouisInOverHisHead } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Chef Louis - In Over His Head", () => {
//   it("should be a vanilla character with correct stats and no special abilities", () => {
//     const testEngine = new TestEngine({
//       play: [chefLouisInOverHisHead],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(chefLouisInOverHisHead);
//
//     // Verify card is in play
//     expect(cardUnderTest.zone).toBe("play");
//
//     // Verify base stats
//     expect(cardUnderTest.lorcanitoCard.cost).toBe(7);
//     expect(cardUnderTest.lorcanitoCard.strength).toBe(6);
//     expect(cardUnderTest.lorcanitoCard.willpower).toBe(8);
//     expect(cardUnderTest.lorcanitoCard.lore).toBe(3);
//
//     // Verify characteristics
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("storyborn");
//
//     // Verify color and inkwell
//     expect(cardUnderTest.lorcanitoCard.colors).toContain("sapphire");
//     expect(cardUnderTest.lorcanitoCard.inkwell).toBe(true);
//
//     // Verify no special abilities
//     expect(cardUnderTest.lorcanitoCard.abilities).toEqual([]);
//   });
//
//   it("should be able to quest for lore", async () => {
//     const testEngine = new TestEngine({
//       play: [chefLouisInOverHisHead],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(chefLouisInOverHisHead);
//
//     const initialLore = testEngine.store.tableStore.getTable("player_one").lore;
//
//     cardUnderTest.quest();
//
//     expect(testEngine.store.tableStore.getTable("player_one").lore).toBe(
//       initialLore + 3,
//     );
//     expect(cardUnderTest.meta.exerted).toBe(true);
//   });
//
//   it("should be playable from hand with correct ink cost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: chefLouisInOverHisHead.cost,
//       hand: [chefLouisInOverHisHead],
//     });
//
//     const cardModel = testEngine.getCardModel(chefLouisInOverHisHead);
//
//     expect(cardModel.zone).toBe("hand");
//
//     await testEngine.playCard(chefLouisInOverHisHead);
//
//     expect(cardModel.zone).toBe("play");
//     expect(
//       testEngine.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toBe(0);
//   });
//
//   it("should be able to be used as ink", async () => {
//     const testEngine = new TestEngine({
//       hand: [chefLouisInOverHisHead],
//     });
//
//     const cardModel = testEngine.getCardModel(chefLouisInOverHisHead);
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
