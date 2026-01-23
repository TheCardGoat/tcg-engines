// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { captainHookCaptainOfTheJollyRoger } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Captain Hook - Captain of the Jolly Roger", () => {
//   it.skip("**DOUBLE THE POWDER!** When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: captainHookCaptainOfTheJollyRoger.cost,
//       hand: [captainHookCaptainOfTheJollyRoger],
//     });
//
//     await testEngine.playCard(captainHookCaptainOfTheJollyRoger);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
