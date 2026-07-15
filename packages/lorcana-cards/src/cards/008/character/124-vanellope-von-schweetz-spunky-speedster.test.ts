// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { vanellopeVonSchweetzSpunkySpeedster } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Vanellope Von Schweetz - Spunky Speedster", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [vanellopeVonSchweetzSpunkySpeedster],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       VanellopeVonSchweetzSpunkySpeedster,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
