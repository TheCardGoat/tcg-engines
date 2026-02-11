// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { generalLiHeadOfTheImperialArmy } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("General Li - Head of the Imperial Army", () => {
//   It.skip("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [generalLiHeadOfTheImperialArmy],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       GeneralLiHeadOfTheImperialArmy,
//     );
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
