// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { belleAccomplishedMystic } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Belle - Accomplished Mystic", () => {
//   It.skip("**Shift** 3", async () => {
//     Const testEngine = new TestEngine({
//       Play: [belleAccomplishedMystic],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(belleAccomplishedMystic);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("**ENHANCED HEALING** When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: belleAccomplishedMystic.cost,
//       Hand: [belleAccomplishedMystic],
//     });
//
//     Await testEngine.playCard(belleAccomplishedMystic);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
