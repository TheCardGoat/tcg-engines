// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSpectacularSinger,
//   MickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { pegNaturalPerformer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Peg - Born for the stage", () => {
//   Describe("CAPTIVE AUDIENCE {E} – If you have at least 3 other characters in play, draw a card.", () => {
//     It("Draws a card if there are at least 3 other characters in play.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: pegNaturalPerformer.cost,
//         Play: [
//           PegNaturalPerformer,
//           MrSmeeBumblingMate,
//           MrSmeeBumblingMate,
//           MrSmeeBumblingMate,
//         ],
//         Hand: [],
//         Deck: [arielSpectacularSinger, mickeyBraveLittleTailor],
//       });
//
//       Await testEngine.activateCard(pegNaturalPerformer);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     });
//
//     It("Does not draw a card if there are less than 3 other characters in play.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: pegNaturalPerformer.cost,
//         Play: [pegNaturalPerformer, mrSmeeBumblingMate, mrSmeeBumblingMate],
//         Hand: [],
//         Deck: [arielSpectacularSinger, mickeyBraveLittleTailor],
//       });
//
//       Await testEngine.activateCard(pegNaturalPerformer);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     });
//   });
// });
//
