// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { jasmineRoyalCommodore } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Jasmine - Royal Commodore", () => {
//   it.skip("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jasmine.)", async () => {
//     const testEngine = new TestEngine({
//       play: [jasmineRoyalCommodore],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(jasmineRoyalCommodore);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it.skip("RULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: jasmineRoyalCommodore.cost,
//       hand: [jasmineRoyalCommodore],
//     });
//
//     await testEngine.playCard(jasmineRoyalCommodore);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
