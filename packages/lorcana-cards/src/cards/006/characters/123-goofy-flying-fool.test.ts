// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyFlyingFool } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goofy - Flying Fool", () => {
//   It.skip("Rush (This character can challenge the turn they're played.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [goofyFlyingFool],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(goofyFlyingFool);
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [goofyFlyingFool],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(goofyFlyingFool);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
