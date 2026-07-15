// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { beKingUndisputed } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Be King Undisputed", () => {
//   It.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: beKingUndisputed.cost,
//       Play: [beKingUndisputed],
//       Hand: [beKingUndisputed],
//     });
//
//     Await testEngine.playCard(beKingUndisputed);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Each opponent chooses and banishes one of their characters.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: beKingUndisputed.cost,
//       Play: [beKingUndisputed],
//       Hand: [beKingUndisputed],
//     });
//
//     Await testEngine.playCard(beKingUndisputed);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
