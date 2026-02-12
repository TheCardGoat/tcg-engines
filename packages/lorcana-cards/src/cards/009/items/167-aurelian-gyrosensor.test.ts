// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { aurelianGyrosensor } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Aurelian Gyrosensor", () => {
//   It.skip("**SEEKING KNOWLEDGE** Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aurelianGyrosensor.cost,
//       Play: [aurelianGyrosensor],
//       Hand: [aurelianGyrosensor],
//     });
//
//     Await testEngine.playCard(aurelianGyrosensor);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
