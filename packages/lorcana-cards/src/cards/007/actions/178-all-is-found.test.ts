// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   AllIsFound,
//   ScroogeMcduckResourcefulMiser,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("All Is Found", () => {
//   It("Put up to 2 cards from your discard into your inkwell, facedown and exerted", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: allIsFound.cost,
//       Hand: [allIsFound],
//       Discard: [arielSpectacularSinger, scroogeMcduckResourcefulMiser],
//     });
//
//     Await testEngine.playCard(allIsFound);
//     Await testEngine.resolveTopOfStack({
//       Targets: [arielSpectacularSinger, scroogeMcduckResourcefulMiser],
//     });
//
//     Expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe(
//       "inkwell",
//     );
//     Expect(testEngine.getCardModel(arielSpectacularSinger).exerted).toBe(true);
//     Expect(testEngine.getCardModel(scroogeMcduckResourcefulMiser).zone).toBe(
//       "inkwell",
//     );
//     Expect(testEngine.getCardModel(scroogeMcduckResourcefulMiser).exerted).toBe(
//       True,
//     );
//   });
// });
//
