// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { inkrunner } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Inkrunner", () => {
//   it.skip("PREFLIGHT CHECK When you play this item, draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: inkrunner.cost,
//       play: [inkrunner],
//       hand: [inkrunner],
//     });
//
//     await testEngine.playCard(inkrunner);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("READY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: inkrunner.cost,
//       play: [inkrunner],
//       hand: [inkrunner],
//     });
//
//     await testEngine.playCard(inkrunner);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
