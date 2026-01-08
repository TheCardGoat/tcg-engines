// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { beKingUndisputed } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Be King Undisputed", () => {
//   it.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: beKingUndisputed.cost,
//       play: [beKingUndisputed],
//       hand: [beKingUndisputed],
//     });
//
//     await testEngine.playCard(beKingUndisputed);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Each opponent chooses and banishes one of their characters.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: beKingUndisputed.cost,
//       play: [beKingUndisputed],
//       hand: [beKingUndisputed],
//     });
//
//     await testEngine.playCard(beKingUndisputed);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
