// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { svenKeeneyedReindeer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sven - Keen-Eyed Reindeer", () => {
//   It.skip("Rush (This character can challenge the turn they’re played.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [svenKeeneyedReindeer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(svenKeeneyedReindeer);
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   It.skip("FORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: svenKeeneyedReindeer.cost,
//       Hand: [svenKeeneyedReindeer],
//     });
//
//     Await testEngine.playCard(svenKeeneyedReindeer);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
