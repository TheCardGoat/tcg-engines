// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { madamMimTinyAdversary } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Madam Mim - Tiny Adversary", () => {
//   It.skip("Challenger +1 (While challenging, this character gets +1 {S}.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [madamMimTinyAdversary],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(madamMimTinyAdversary);
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
//
//   It.skip("ZIM ZABBERIM ZIM Your other characters gain Challenger +1.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: madamMimTinyAdversary.cost,
//       Play: [madamMimTinyAdversary],
//       Hand: [madamMimTinyAdversary],
//     });
//
//     Await testEngine.playCard(madamMimTinyAdversary);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
