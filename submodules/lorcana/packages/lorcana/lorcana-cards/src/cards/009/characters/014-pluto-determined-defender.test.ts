// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { plutoDeterminedDefender } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pluto - Determined Defender", () => {
//   It.skip("**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Pluto.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [plutoDeterminedDefender],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(plutoDeterminedDefender);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [plutoDeterminedDefender],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(plutoDeterminedDefender);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It.skip("**GUARD DOG** At the start of your turn, remove up to 3 damage from this character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: plutoDeterminedDefender.cost,
//       Play: [plutoDeterminedDefender],
//       Hand: [plutoDeterminedDefender],
//     });
//
//     Await testEngine.playCard(plutoDeterminedDefender);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
