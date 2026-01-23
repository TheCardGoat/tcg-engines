// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { genieWishFulfilled } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Genie - Wish Fulfilled", () => {
//   it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [genieWishFulfilled],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(genieWishFulfilled);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it.skip("WHAT HAPPENS NOW? When you play this character, draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: genieWishFulfilled.cost,
//       hand: [genieWishFulfilled],
//     });
//
//     await testEngine.playCard(genieWishFulfilled);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
