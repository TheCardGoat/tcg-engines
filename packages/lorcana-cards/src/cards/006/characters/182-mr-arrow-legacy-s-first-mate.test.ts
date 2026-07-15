// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrArrowLegacysFirstMate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mr. Arrow - Legacy's First Mate", () => {
//   It.skip("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mrArrowLegacysFirstMate],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mrArrowLegacysFirstMate);
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
