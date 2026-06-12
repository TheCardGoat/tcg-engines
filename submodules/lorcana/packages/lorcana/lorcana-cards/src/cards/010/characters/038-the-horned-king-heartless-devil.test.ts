// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theHornedKingHeartlessDevil } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Horned King - Heartless Devil", () => {
//   It("should be a vanilla character with no special abilities", () => {
//     Const testEngine = new TestEngine({
//       Play: [theHornedKingHeartlessDevil],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(theHornedKingHeartlessDevil);
//
//     // Verify card is in play
//     Expect(cardUnderTest.zone).toBe("play");
//
//     // Verify base stats
//     Expect(cardUnderTest.lorcanitoCard.cost).toBe(1);
//     Expect(cardUnderTest.lorcanitoCard.strength).toBe(2);
//     Expect(cardUnderTest.lorcanitoCard.willpower).toBe(2);
//     Expect(cardUnderTest.lorcanitoCard.lore).toBe(1);
//
//     // Verify characteristics
//     Expect(cardUnderTest.lorcanitoCard.characteristics).toContain("storyborn");
//     Expect(cardUnderTest.lorcanitoCard.characteristics).toContain("villain");
//     Expect(cardUnderTest.lorcanitoCard.characteristics).toContain("king");
//     Expect(cardUnderTest.lorcanitoCard.characteristics).toContain("sorcerer");
//
//     // Verify color and inkwell
//     Expect(cardUnderTest.lorcanitoCard.colors).toContain("amethyst");
//     Expect(cardUnderTest.lorcanitoCard.inkwell).toBe(true);
//
//     // Verify no special abilities
//     Expect(cardUnderTest.lorcanitoCard.abilities).toEqual([]);
//     Expect(cardUnderTest.lorcanitoCard.text).toBe("");
//   });
//
//   It("should be able to quest for lore", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theHornedKingHeartlessDevil],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(theHornedKingHeartlessDevil);
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
//       Inkwell: theHornedKingHeartlessDevil.cost,
//       Hand: [theHornedKingHeartlessDevil],
//     });
//
//     Const cardModel = testEngine.getCardModel(theHornedKingHeartlessDevil);
//
//     Expect(cardModel.zone).toBe("hand");
//
//     Await testEngine.playCard(theHornedKingHeartlessDevil);
//
//     Expect(cardModel.zone).toBe("play");
//     Expect(
//       TestEngine.store.tableStore.getTable("player_one").inkAvailable(),
//     ).toBe(0);
//   });
// });
//
