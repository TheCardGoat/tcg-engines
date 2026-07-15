// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { jasmineRoyalCommodore } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jasmine - Royal Commodore", () => {
//   It.skip("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jasmine.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [jasmineRoyalCommodore],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(jasmineRoyalCommodore);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("RULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jasmineRoyalCommodore.cost,
//       Hand: [jasmineRoyalCommodore],
//     });
//
//     Await testEngine.playCard(jasmineRoyalCommodore);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
