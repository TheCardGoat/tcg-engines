// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { iFindEmIFlattenEm } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("I Find 'Em, I Flatten 'Em", () => {
//   it.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: iFindEmIFlattenEm.cost,
//       play: [iFindEmIFlattenEm],
//       hand: [iFindEmIFlattenEm],
//     });
//
//     await testEngine.playCard(iFindEmIFlattenEm);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Banish all items.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: iFindEmIFlattenEm.cost,
//       play: [iFindEmIFlattenEm],
//       hand: [iFindEmIFlattenEm],
//     });
//
//     await testEngine.playCard(iFindEmIFlattenEm);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
