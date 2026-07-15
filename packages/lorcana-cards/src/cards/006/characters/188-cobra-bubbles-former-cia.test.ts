// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cobraBubblesFormerCia } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cobra Bubbles - Former CIA", () => {
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [cobraBubblesFormerCia],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(cobraBubblesFormerCia);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It.skip("THINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: cobraBubblesFormerCia.cost,
//       Play: [cobraBubblesFormerCia],
//       Hand: [cobraBubblesFormerCia],
//     });
//
//     Await testEngine.playCard(cobraBubblesFormerCia);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
