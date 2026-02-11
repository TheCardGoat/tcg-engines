// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mickeyMouseTrumpeter } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Trumpeter", () => {
//   It.skip("**BUGLE CALL** {E}, 2 {I} - Play a character for free.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mickeyMouseTrumpeter.cost,
//       Play: [mickeyMouseTrumpeter],
//       Hand: [mickeyMouseTrumpeter],
//     });
//
//     Await testEngine.playCard(mickeyMouseTrumpeter);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
