// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { worldsGreatestCriminalMind } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("World's Greatest Criminal Mind", () => {
//   It.skip("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: worldsGreatestCriminalMind.cost,
//       Play: [worldsGreatestCriminalMind],
//       Hand: [worldsGreatestCriminalMind],
//     });
//
//     Await testEngine.playCard(worldsGreatestCriminalMind);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Banish chosen character with 5 {S} or more.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: worldsGreatestCriminalMind.cost,
//       Play: [worldsGreatestCriminalMind],
//       Hand: [worldsGreatestCriminalMind],
//     });
//
//     Await testEngine.playCard(worldsGreatestCriminalMind);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
