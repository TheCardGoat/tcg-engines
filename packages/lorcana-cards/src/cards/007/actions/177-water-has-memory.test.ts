// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AllIsFound,
//   DoubleTrouble,
//   ShowMeMore,
//   TheReturnOfHercules,
//   WaterHasMemory,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Water Has Memory", () => {
//   Describe("Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.", () => {
//     It("Own deck", async () => {
//       Const testEngine = new TestEngine({
//         Deck: [doubleTrouble, allIsFound, theReturnOfHercules, showMeMore],
//         Inkwell: waterHasMemory.cost,
//         Hand: [waterHasMemory],
//       });
//
//       Await testEngine.playCard(
//         WaterHasMemory,
//         {
//           TargetPlayer: "player_one",
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Top: [doubleTrouble],
//           Bottom: [allIsFound, theReturnOfHercules, showMeMore],
//         },
//       });
//
//       Await testEngine.drawCard();
//       Expect(testEngine.getCardModel(doubleTrouble).zone).toBe("hand");
//     });
//
//     It("Opponent deck", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 10,
//           Inkwell: waterHasMemory.cost,
//           Hand: [waterHasMemory],
//         },
//         {
//           Deck: [doubleTrouble, allIsFound, theReturnOfHercules, showMeMore],
//         },
//       );
//
//       Await testEngine.playCard(
//         WaterHasMemory,
//         {
//           TargetPlayer: "player_two",
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Top: [doubleTrouble],
//           Bottom: [allIsFound, theReturnOfHercules, showMeMore],
//         },
//       });
//
//       Await testEngine.drawCard("player_two");
//       Expect(testEngine.getCardModel(doubleTrouble).zone).toBe("hand");
//     });
//   });
// });
//
