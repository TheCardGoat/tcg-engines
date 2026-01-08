// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { cobraBubblesFormerCia } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Cobra Bubbles - Former CIA", () => {
//   it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [cobraBubblesFormerCia],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(cobraBubblesFormerCia);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   it.skip("THINK ABOUT WHAT'S BEST 2 {I} – Draw a card, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: cobraBubblesFormerCia.cost,
//       play: [cobraBubblesFormerCia],
//       hand: [cobraBubblesFormerCia],
//     });
//
//     await testEngine.playCard(cobraBubblesFormerCia);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
