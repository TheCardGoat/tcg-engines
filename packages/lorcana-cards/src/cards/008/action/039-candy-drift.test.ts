// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseFoodFightDefender } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { candyDrift } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Candy Drift", () => {
//   It("Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: candyDrift.cost,
//       Play: [mickeyMouseFoodFightDefender],
//       Hand: [candyDrift],
//       Deck: 10,
//     });
//
//     Await testEngine.playCard(candyDrift, {
//       Targets: [mickeyMouseFoodFightDefender],
//     });
//
//     Expect(testEngine.getCardModel(mickeyMouseFoodFightDefender).strength).toBe(
//       MickeyMouseFoodFightDefender.strength + 5,
//     );
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(mickeyMouseFoodFightDefender).zone).toBe(
//       "discard",
//     );
//   });
//
//   It("Draws a card without a target for rest of it", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: candyDrift.cost,
//       Play: [],
//       Hand: [candyDrift],
//       Deck: 10,
//     });
//
//     Await testEngine.playCard(candyDrift);
//     Await testEngine.resolveTopOfStack({}, true);
//
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
