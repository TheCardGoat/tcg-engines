// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { seekingTheHalfCrown } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Seeking The Half Crown", () => {
//   It.skip("For each Sorcerer character you have in play, you pay 1 {I} less to play this action.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: seekingTheHalfCrown.cost,
//       Play: [seekingTheHalfCrown],
//       Hand: [seekingTheHalfCrown],
//     });
//
//     Await testEngine.playCard(seekingTheHalfCrown);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Draw 2 cards.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: seekingTheHalfCrown.cost,
//       Play: [seekingTheHalfCrown],
//       Hand: [seekingTheHalfCrown],
//     });
//
//     Await testEngine.playCard(seekingTheHalfCrown);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
