// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { oneJumpAhead } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("One Jump Ahead", () => {
//   it.skip("_(A character with cost 2 or more can {E} to sing this song for free.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: oneJumpAhead.cost,
//       play: [oneJumpAhead],
//       hand: [oneJumpAhead],
//     });
//
//     await testEngine.playCard(oneJumpAhead);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: oneJumpAhead.cost,
//       play: [oneJumpAhead],
//       hand: [oneJumpAhead],
//     });
//
//     await testEngine.playCard(oneJumpAhead);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
