// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { orRewriteHistory } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Or Rewrite History!", () => {
//   It.skip("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: orRewriteHistory.cost,
//       Play: [orRewriteHistory],
//       Hand: [orRewriteHistory],
//     });
//
//     Await testEngine.playCard(orRewriteHistory);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Return a character card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: orRewriteHistory.cost,
//       Play: [orRewriteHistory],
//       Hand: [orRewriteHistory],
//     });
//
//     Await testEngine.playCard(orRewriteHistory);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
