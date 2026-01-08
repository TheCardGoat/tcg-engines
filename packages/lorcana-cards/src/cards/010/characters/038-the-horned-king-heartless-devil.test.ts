// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { theHornedKingHeartlessDevil } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Horned King - Heartless Devil", () => {
//   it("should be a vanilla character with no special abilities", () => {
//     const testEngine = new TestEngine({
//       play: [theHornedKingHeartlessDevil],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(theHornedKingHeartlessDevil);
//
//     // Verify card is in play
//     expect(cardUnderTest.zone).toBe("play");
//
//     // Verify base stats
//     expect(cardUnderTest.lorcanitoCard.cost).toBe(1);
//     expect(cardUnderTest.lorcanitoCard.strength).toBe(2);
//     expect(cardUnderTest.lorcanitoCard.willpower).toBe(2);
//     expect(cardUnderTest.lorcanitoCard.lore).toBe(1);
//
//     // Verify characteristics
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("storyborn");
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("villain");
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("king");
//     expect(cardUnderTest.lorcanitoCard.characteristics).toContain("sorcerer");
//
//     // Verify color and inkwell
//     expect(cardUnderTest.lorcanitoCard.colors).toContain("amethyst");
//     expect(cardUnderTest.lorcanitoCard.inkwell).toBe(true);
//
//     // Verify no special abilities
//     expect(cardUnderTest.lorcanitoCard.abilities).toEqual([]);
//     expect(cardUnderTest.lorcanitoCard.text).toBe("");
//   });
//
//   it("should be able to quest for lore", async () => {
//     const testEngine = new TestEngine({
//       play: [theHornedKingHeartlessDevil],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(theHornedKingHeartlessDevil);
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
//       inkwell: theHornedKingHeartlessDevil.cost,
//       hand: [theHornedKingHeartlessDevil],
//     });
//
//     const cardModel = testEngine.getCardModel(theHornedKingHeartlessDevil);
//
//     expect(cardModel.zone).toBe("hand");
//
//     await testEngine.playCard(theHornedKingHeartlessDevil);
//
//     expect(cardModel.zone).toBe("play");
//     expect(
//       testEngine.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toBe(0);
//   });
// });
//
