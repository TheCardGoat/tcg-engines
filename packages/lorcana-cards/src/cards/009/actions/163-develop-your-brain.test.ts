// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { developYourBrain } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Develop Your Brain", () => {
//   it.skip("Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: developYourBrain.cost,
//       play: [developYourBrain],
//       hand: [developYourBrain],
//     });
//
//     await testEngine.playCard(developYourBrain);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
