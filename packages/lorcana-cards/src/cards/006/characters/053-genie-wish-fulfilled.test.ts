// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { genieWishFulfilled } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Genie - Wish Fulfilled", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [genieWishFulfilled],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(genieWishFulfilled);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It.skip("WHAT HAPPENS NOW? When you play this character, draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: genieWishFulfilled.cost,
//       Hand: [genieWishFulfilled],
//     });
//
//     Await testEngine.playCard(genieWishFulfilled);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
