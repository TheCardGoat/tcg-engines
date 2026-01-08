// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { orRewriteHistory } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Or Rewrite History!", () => {
//   it.skip("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: orRewriteHistory.cost,
//       play: [orRewriteHistory],
//       hand: [orRewriteHistory],
//     });
//
//     await testEngine.playCard(orRewriteHistory);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Return a character card from your discard to your hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: orRewriteHistory.cost,
//       play: [orRewriteHistory],
//       hand: [orRewriteHistory],
//     });
//
//     await testEngine.playCard(orRewriteHistory);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
