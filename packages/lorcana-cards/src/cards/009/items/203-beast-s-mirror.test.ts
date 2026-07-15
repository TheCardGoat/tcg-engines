// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { beastsMirror } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Beast's Mirror", () => {
//   It.skip("**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: beastsMirror.cost,
//       Play: [beastsMirror],
//       Hand: [beastsMirror],
//     });
//
//     Await testEngine.playCard(beastsMirror);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
