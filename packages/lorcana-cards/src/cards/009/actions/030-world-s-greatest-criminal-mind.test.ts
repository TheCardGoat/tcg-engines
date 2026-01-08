// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { worldsGreatestCriminalMind } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("World's Greatest Criminal Mind", () => {
//   it.skip("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: worldsGreatestCriminalMind.cost,
//       play: [worldsGreatestCriminalMind],
//       hand: [worldsGreatestCriminalMind],
//     });
//
//     await testEngine.playCard(worldsGreatestCriminalMind);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("Banish chosen character with 5 {S} or more.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: worldsGreatestCriminalMind.cost,
//       play: [worldsGreatestCriminalMind],
//       hand: [worldsGreatestCriminalMind],
//     });
//
//     await testEngine.playCard(worldsGreatestCriminalMind);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
