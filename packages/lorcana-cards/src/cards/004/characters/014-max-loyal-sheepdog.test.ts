// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MaxLoyalSheepdog,
//   PrinceEricSeafaringPrince,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Max - Loyal Sheepdog", () => {
//   Describe("**LOYAL**", () => {
//     It("If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: maxLoyalSheepdog.cost,
//         Play: [princeEricSeafaringPrince],
//         Hand: [maxLoyalSheepdog],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(maxLoyalSheepdog);
//
//       Expect(cardUnderTest.cost).toBe(maxLoyalSheepdog.cost - 1);
//     });
//     It("Without Prince Eric in play, you pay full cost.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: maxLoyalSheepdog.cost,
//         Hand: [maxLoyalSheepdog],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(maxLoyalSheepdog);
//
//       Expect(cardUnderTest.cost).toBe(maxLoyalSheepdog.cost);
//     });
//   });
// });
//
