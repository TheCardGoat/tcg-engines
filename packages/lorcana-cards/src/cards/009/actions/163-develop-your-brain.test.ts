// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { developYourBrain } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Develop Your Brain", () => {
//   It.skip("Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: developYourBrain.cost,
//       Play: [developYourBrain],
//       Hand: [developYourBrain],
//     });
//
//     Await testEngine.playCard(developYourBrain);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
