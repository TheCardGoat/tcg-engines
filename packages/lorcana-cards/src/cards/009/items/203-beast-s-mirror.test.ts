// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { beastsMirror } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Beast's Mirror", () => {
//   it.skip("**SHOW ME** {E}, 3 {I} - If you have no cards in your hand, draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: beastsMirror.cost,
//       play: [beastsMirror],
//       hand: [beastsMirror],
//     });
//
//     await testEngine.playCard(beastsMirror);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
