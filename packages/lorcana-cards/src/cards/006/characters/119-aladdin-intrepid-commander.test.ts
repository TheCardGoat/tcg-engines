// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { aladdinIntrepidCommander } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Aladdin - Intrepid Commander", () => {
//   It.skip("Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aladdin.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [aladdinIntrepidCommander],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(aladdinIntrepidCommander);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("REMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aladdinIntrepidCommander.cost,
//       Hand: [aladdinIntrepidCommander],
//     });
//
//     Await testEngine.playCard(aladdinIntrepidCommander);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
