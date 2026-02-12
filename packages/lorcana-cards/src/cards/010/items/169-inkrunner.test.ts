// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { inkrunner } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Inkrunner", () => {
//   It.skip("PREFLIGHT CHECK When you play this item, draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: inkrunner.cost,
//       Play: [inkrunner],
//       Hand: [inkrunner],
//     });
//
//     Await testEngine.playCard(inkrunner);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("READY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: inkrunner.cost,
//       Play: [inkrunner],
//       Hand: [inkrunner],
//     });
//
//     Await testEngine.playCard(inkrunner);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
