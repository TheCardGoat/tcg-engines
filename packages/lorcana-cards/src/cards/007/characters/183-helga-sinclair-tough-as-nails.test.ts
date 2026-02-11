// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { helgaSinclairToughAsNails } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Helga Sinclair - Tough as Nails", () => {
//   It.skip("Challenger +3 (While challenging, this character gets +3 {S}).", async () => {
//     Const testEngine = new TestEngine({
//       Play: [helgaSinclairToughAsNails],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(helgaSinclairToughAsNails);
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
//
//   It.skip("QUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: helgaSinclairToughAsNails.cost,
//       Play: [helgaSinclairToughAsNails],
//       Hand: [helgaSinclairToughAsNails],
//     });
//
//     Await testEngine.playCard(helgaSinclairToughAsNails);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
