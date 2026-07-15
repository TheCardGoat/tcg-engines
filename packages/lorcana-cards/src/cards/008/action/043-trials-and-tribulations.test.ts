// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { trialsAndTribulations } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Trials And Tribulations", () => {
//   It.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: trialsAndTribulations.cost,
//       Play: [trialsAndTribulations],
//       Hand: [trialsAndTribulations],
//     });
//
//     Await testEngine.playCard(trialsAndTribulations);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Chosen character gets -4 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: trialsAndTribulations.cost,
//       Play: [trialsAndTribulations],
//       Hand: [trialsAndTribulations],
//     });
//
//     Await testEngine.playCard(trialsAndTribulations);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
