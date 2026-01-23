// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   maxLoyalSheepdog,
//   princeEricSeafaringPrince,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Max - Loyal Sheepdog", () => {
//   describe("**LOYAL**", () => {
//     it("If you have a character named Prince Eric in play, you pay 1 {I} less to play this character.", async () => {
//       const testEngine = new TestEngine({
//         inkwell: maxLoyalSheepdog.cost,
//         play: [princeEricSeafaringPrince],
//         hand: [maxLoyalSheepdog],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(maxLoyalSheepdog);
//
//       expect(cardUnderTest.cost).toBe(maxLoyalSheepdog.cost - 1);
//     });
//     it("Without Prince Eric in play, you pay full cost.", async () => {
//       const testEngine = new TestEngine({
//         inkwell: maxLoyalSheepdog.cost,
//         hand: [maxLoyalSheepdog],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(maxLoyalSheepdog);
//
//       expect(cardUnderTest.cost).toBe(maxLoyalSheepdog.cost);
//     });
//   });
// });
//
