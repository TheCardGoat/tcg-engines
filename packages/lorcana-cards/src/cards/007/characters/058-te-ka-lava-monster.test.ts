// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { teKaLavaMonster } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Te Ka - Lava Monster", () => {
//   it.skip("Challenger +2 (While challenging, this character gets +2 {S}).", async () => {
//     const testEngine = new TestEngine({
//       play: [teKaLavaMonster],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(teKaLavaMonster);
//     expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
