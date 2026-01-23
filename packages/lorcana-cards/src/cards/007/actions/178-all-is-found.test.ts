// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   allIsFound,
//   scroogeMcduckResourcefulMiser,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("All Is Found", () => {
//   it("Put up to 2 cards from your discard into your inkwell, facedown and exerted", async () => {
//     const testEngine = new TestEngine({
//       inkwell: allIsFound.cost,
//       hand: [allIsFound],
//       discard: [arielSpectacularSinger, scroogeMcduckResourcefulMiser],
//     });
//
//     await testEngine.playCard(allIsFound);
//     await testEngine.resolveTopOfStack({
//       targets: [arielSpectacularSinger, scroogeMcduckResourcefulMiser],
//     });
//
//     expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe(
//       "inkwell",
//     );
//     expect(testEngine.getCardModel(arielSpectacularSinger).exerted).toBe(true);
//     expect(testEngine.getCardModel(scroogeMcduckResourcefulMiser).zone).toBe(
//       "inkwell",
//     );
//     expect(testEngine.getCardModel(scroogeMcduckResourcefulMiser).exerted).toBe(
//       true,
//     );
//   });
// });
//
