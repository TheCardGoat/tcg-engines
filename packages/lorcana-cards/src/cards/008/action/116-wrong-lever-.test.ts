// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseGiantMouse,
//   PullTheLever,
//   WrongLeverAction,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wrong Lever!", () => {
//   It("- Return chosen character to their player's hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: wrongLeverAction.cost,
//         Hand: [wrongLeverAction],
//       },
//       {
//         Play: [mickeyMouseGiantMouse],
//       },
//     );
//
//     Await testEngine.playCard(wrongLeverAction, { mode: "1" }, true);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
//
//     Expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("hand");
//   });
//
//   It("- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: wrongLeverAction.cost,
//         Discard: [pullTheLever],
//         Hand: [wrongLeverAction],
//       },
//       {
//         Play: [mickeyMouseGiantMouse],
//       },
//     );
//
//     Await testEngine.playCard(wrongLeverAction);
//
//     Await testEngine.playCard(wrongLeverAction, { mode: "2" }, true);
//     Await testEngine.resolveTopOfStack({ targets: [pullTheLever] }, true);
//     Expect(testEngine.getCardModel(pullTheLever).zone).toBe("deck");
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
//     Expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("deck");
//   });
//
//   It("Selecting second mode without Pull the Lever on discard", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: wrongLeverAction.cost,
//         Hand: [wrongLeverAction],
//       },
//       {
//         Play: [mickeyMouseGiantMouse],
//       },
//     );
//
//     Await testEngine.playCard(wrongLeverAction);
//
//     Await testEngine.playCard(wrongLeverAction, { mode: "2" }, true);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
