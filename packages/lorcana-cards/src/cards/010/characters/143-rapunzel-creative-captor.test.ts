// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { rapunzelCreativeCaptor } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Rapunzel - Creative Captor", () => {
//   it.skip("ENSNARL When you play this character, chosen opposing character gets -3 this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: rapunzelCreativeCaptor.cost,
//       hand: [rapunzelCreativeCaptor],
//     });
//
//     await testEngine.playCard(rapunzelCreativeCaptor);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
