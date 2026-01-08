// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { medallionWeights } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Medallion Weights", () => {
//   it.skip("**DISCIPLINE AND STRENGTH** {E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: medallionWeights.cost,
//       play: [medallionWeights],
//       hand: [medallionWeights],
//     });
//
//     await testEngine.playCard(medallionWeights);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
