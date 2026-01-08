// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { trialsAndTribulations } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Trials And Tribulations", () => {
//   it.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: trialsAndTribulations.cost,
//       play: [trialsAndTribulations],
//       hand: [trialsAndTribulations],
//     });
//
//     await testEngine.playCard(trialsAndTribulations);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Chosen character gets -4 {S} until the start of your next turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: trialsAndTribulations.cost,
//       play: [trialsAndTribulations],
//       hand: [trialsAndTribulations],
//     });
//
//     await testEngine.playCard(trialsAndTribulations);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
