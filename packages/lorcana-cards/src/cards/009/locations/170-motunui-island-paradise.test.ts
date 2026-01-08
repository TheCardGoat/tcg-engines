// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { motunuiIslandParadise } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Motunui - Island Paradise", () => {
//   it.skip("**REINCARNATION** Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: motunuiIslandParadise.cost,
//       play: [motunuiIslandParadise],
//       hand: [motunuiIslandParadise],
//     });
//
//     await testEngine.playCard(motunuiIslandParadise);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
