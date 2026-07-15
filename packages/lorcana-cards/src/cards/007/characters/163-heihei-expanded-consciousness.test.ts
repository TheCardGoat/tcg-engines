// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DawsonPuzzlingSleuth,
//   HeiheiExpandedConsciousness,
//   LuckyRuntOfTheLitter,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Heihei - Expanded Consciousness", () => {
//   It("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Heihei.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [heiheiExpandedConsciousness],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(heiheiExpandedConsciousness);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("Resist +1 (Damage dealt to this character is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [heiheiExpandedConsciousness],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(heiheiExpandedConsciousness);
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
//
//   It("CLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: heiheiExpandedConsciousness.cost,
//       Hand: [
//         HeiheiExpandedConsciousness,
//         LuckyRuntOfTheLitter,
//         DawsonPuzzlingSleuth,
//       ],
//     });
//
//     Await testEngine.playCard(heiheiExpandedConsciousness);
//
//     Expect(testEngine.getCardModel(heiheiExpandedConsciousness).zone).toBe(
//       "play",
//     );
//     Expect(testEngine.getCardModel(luckyRuntOfTheLitter).zone).toBe("inkwell");
//     Expect(testEngine.getCardModel(dawsonPuzzlingSleuth).zone).toBe("inkwell");
//   });
// });
//
