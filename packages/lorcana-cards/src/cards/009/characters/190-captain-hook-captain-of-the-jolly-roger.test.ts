// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { captainHookCaptainOfTheJollyRoger } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Captain Hook - Captain of the Jolly Roger", () => {
//   It.skip("**DOUBLE THE POWDER!** When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: captainHookCaptainOfTheJollyRoger.cost,
//       Hand: [captainHookCaptainOfTheJollyRoger],
//     });
//
//     Await testEngine.playCard(captainHookCaptainOfTheJollyRoger);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
