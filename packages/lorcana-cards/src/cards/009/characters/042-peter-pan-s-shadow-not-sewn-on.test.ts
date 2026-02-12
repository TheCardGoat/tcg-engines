// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { peterPansShadowNotSewnOn } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Peter Pan's Shadow - Not Sewn On", () => {
//   It.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [peterPansShadowNotSewnOn],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(peterPansShadowNotSewnOn);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It.skip("**Rush** _(This character can challenge the turn they're played.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [peterPansShadowNotSewnOn],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(peterPansShadowNotSewnOn);
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   It.skip("**TIPTOE** Your other characters with **Rush** gain **Evasive**.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: peterPansShadowNotSewnOn.cost,
//       Play: [peterPansShadowNotSewnOn],
//       Hand: [peterPansShadowNotSewnOn],
//     });
//
//     Await testEngine.playCard(peterPansShadowNotSewnOn);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
