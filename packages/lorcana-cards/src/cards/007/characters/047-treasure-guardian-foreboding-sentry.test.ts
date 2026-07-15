// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { madamMimSnake } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   RajahGhostlyTiger,
//   TreasureGuardianForebodingSentry,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Treasure Guardian - Foreboding Sentry", () => {
//   It("UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: treasureGuardianForebodingSentry.cost,
//       Hand: [treasureGuardianForebodingSentry],
//       Play: [rajahGhostlyTiger],
//       Deck: [madamMimSnake],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       TreasureGuardianForebodingSentry,
//     );
//
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//     Await testEngine.playCard(cardUnderTest);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(0);
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//   });
//
//   It("Regression - ensure card is not drawn on non-illusion characters", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: treasureGuardianForebodingSentry.cost,
//       Hand: [treasureGuardianForebodingSentry],
//       Play: [madamMimSnake],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       TreasureGuardianForebodingSentry,
//     );
//
//     Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//     Await testEngine.playCard(cardUnderTest);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(0);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getZonesCardCount().hand).toEqual(0);
//   });
// });
//
