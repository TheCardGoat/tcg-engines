// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { mickeyMouseTrumpeter } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mickey Mouse - Trumpeter", () => {
//   it.skip("**BUGLE CALL** {E}, 2 {I} - Play a character for free.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mickeyMouseTrumpeter.cost,
//       play: [mickeyMouseTrumpeter],
//       hand: [mickeyMouseTrumpeter],
//     });
//
//     await testEngine.playCard(mickeyMouseTrumpeter);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
