// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { teKaLavaMonster } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Te Ka - Lava Monster", () => {
//   It.skip("Challenger +2 (While challenging, this character gets +2 {S}).", async () => {
//     Const testEngine = new TestEngine({
//       Play: [teKaLavaMonster],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(teKaLavaMonster);
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
