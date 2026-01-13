// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { aurelianGyrosensor } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Aurelian Gyrosensor", () => {
//   it.skip("**SEEKING KNOWLEDGE** Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: aurelianGyrosensor.cost,
//       play: [aurelianGyrosensor],
//       hand: [aurelianGyrosensor],
//     });
//
//     await testEngine.playCard(aurelianGyrosensor);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
