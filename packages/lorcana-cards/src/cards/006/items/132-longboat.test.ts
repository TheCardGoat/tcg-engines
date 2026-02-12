// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { longboat } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Longboat", () => {
//   It.skip("TAKE IT FOR A SPIN 2 {I} – Chosen character of yours gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: longboat.cost,
//       Play: [longboat],
//       Hand: [longboat],
//     });
//
//     Await testEngine.playCard(longboat);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
