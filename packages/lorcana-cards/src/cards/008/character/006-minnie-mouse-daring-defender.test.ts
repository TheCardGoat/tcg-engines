// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { minnieMouseDaringDefender } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Minnie Mouse - Daring Defender", () => {
//   It("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [minnieMouseDaringDefender],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(minnieMouseDaringDefender);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It("TRUE VALOR This character gets +1 {S} for each 1 damage on her.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [minnieMouseDaringDefender],
//     });
//
//     Const cardToTest = testEngine.getCardModel(minnieMouseDaringDefender);
//     CardToTest.damage = 2;
//
//     Expect(cardToTest.strength).toBe(2);
//   });
// });
//
