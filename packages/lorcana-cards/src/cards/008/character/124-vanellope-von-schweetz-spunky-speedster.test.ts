// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { vanellopeVonSchweetzSpunkySpeedster } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Vanellope Von Schweetz - Spunky Speedster", () => {
//   it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [vanellopeVonSchweetzSpunkySpeedster],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       vanellopeVonSchweetzSpunkySpeedster,
//     );
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
