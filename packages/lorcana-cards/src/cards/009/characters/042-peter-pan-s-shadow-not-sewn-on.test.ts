// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { peterPansShadowNotSewnOn } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Peter Pan's Shadow - Not Sewn On", () => {
//   it.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", async () => {
//     const testEngine = new TestEngine({
//       play: [peterPansShadowNotSewnOn],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(peterPansShadowNotSewnOn);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it.skip("**Rush** _(This character can challenge the turn they're played.)_", async () => {
//     const testEngine = new TestEngine({
//       play: [peterPansShadowNotSewnOn],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(peterPansShadowNotSewnOn);
//     expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   it.skip("**TIPTOE** Your other characters with **Rush** gain **Evasive**.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: peterPansShadowNotSewnOn.cost,
//       play: [peterPansShadowNotSewnOn],
//       hand: [peterPansShadowNotSewnOn],
//     });
//
//     await testEngine.playCard(peterPansShadowNotSewnOn);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
