// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { standOut } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Stand Out", () => {
//   it.skip("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: standOut.cost,
//       play: [standOut],
//       hand: [standOut],
//     });
//
//     await testEngine.playCard(standOut);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Chosen character gets +3 {S} and gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: standOut.cost,
//       play: [standOut],
//       hand: [standOut],
//     });
//
//     await testEngine.playCard(standOut);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
