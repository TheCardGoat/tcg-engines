// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseDetective,
//   SearchForClues,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Search For Clues", () => {
//   It("should trigger discard for player with most cards and gain lore if Detective is in play", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: searchForClues.cost,
//         Hand: [searchForClues],
//         Play: [mickeyMouseDetective],
//         Deck: 10,
//       },
//       {
//         Hand: 3,
//         Deck: 10,
//       },
//     );
//
//     Await testEngine.playCard(searchForClues);
//
//     // Opponent has 3 cards, player one has 0 cards, so only opponent should discard + lore gain
//     Expect(testEngine.stackLayers).toHaveLength(2); // 1 for opponent discard, 1 for lore gain
//   });
//
//   It("should not trigger when no players have cards in hand", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: searchForClues.cost,
//         Hand: [searchForClues],
//         Deck: 5,
//       },
//       {
//         Deck: 5,
//       },
//     );
//
//     Await testEngine.playCard(searchForClues);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(testEngine.getZonesCardCount("player_one").hand).toEqual(0);
//     Expect(testEngine.getZonesCardCount("player_two").hand).toEqual(0);
//   });
//
//   It("should not gain lore when no Detective characters in play", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: searchForClues.cost,
//         Hand: [searchForClues],
//         Deck: 10,
//       },
//       {
//         Hand: 3,
//         Deck: 10,
//       },
//     );
//
//     Const initialLore = testEngine.getPlayerLore("player_one");
//
//     Await testEngine.playCard(searchForClues);
//
//     // Only opponent discard effect, no lore gain
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     // Opponent would discard here, but we're just checking lore wasn't gained
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(initialLore);
//   });
// });
//
