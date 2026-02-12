// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { stabbingtonBrotherWithoutAPatch } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Stabbington Brother - Without a Patch", () => {
//   It.skip("Rush (This character can challenge the turn they're played.) GET 'EM! Your other characters named Stabbington Brother gain Rush.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [stabbingtonBrotherWithoutAPatch],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       StabbingtonBrotherWithoutAPatch,
//     );
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
// });
//
