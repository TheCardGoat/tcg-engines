// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { judyHoppsOptimisticOfficer } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Judy Hopps - Optimistic Officer", () => {
//   It.skip("**DON'T CALL ME CUTE** When you play this character, you may banish chosen item. Its player draws a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: judyHoppsOptimisticOfficer.cost,
//       Hand: [judyHoppsOptimisticOfficer],
//     });
//
//     Await testEngine.playCard(judyHoppsOptimisticOfficer);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
