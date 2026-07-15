// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { peterPanShadowCatcher } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Peter Pan - Shadow Catcher", () => {
//   It.skip("GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: peterPanShadowCatcher.cost,
//       Play: [peterPanShadowCatcher],
//       Hand: [peterPanShadowCatcher],
//     });
//
//     Await testEngine.playCard(peterPanShadowCatcher);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
