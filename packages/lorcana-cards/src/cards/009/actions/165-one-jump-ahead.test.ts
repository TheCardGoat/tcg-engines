// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { oneJumpAhead } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("One Jump Ahead", () => {
//   It.skip("_(A character with cost 2 or more can {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: oneJumpAhead.cost,
//       Play: [oneJumpAhead],
//       Hand: [oneJumpAhead],
//     });
//
//     Await testEngine.playCard(oneJumpAhead);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: oneJumpAhead.cost,
//       Play: [oneJumpAhead],
//       Hand: [oneJumpAhead],
//     });
//
//     Await testEngine.playCard(oneJumpAhead);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
