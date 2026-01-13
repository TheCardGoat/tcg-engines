// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { peterPanShadowCatcher } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Peter Pan - Shadow Catcher", () => {
//   it.skip("GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: peterPanShadowCatcher.cost,
//       play: [peterPanShadowCatcher],
//       hand: [peterPanShadowCatcher],
//     });
//
//     await testEngine.playCard(peterPanShadowCatcher);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
