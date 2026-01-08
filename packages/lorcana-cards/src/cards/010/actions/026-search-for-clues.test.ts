// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyMouseDetective,
//   searchForClues,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Search For Clues", () => {
//   it("should trigger discard for player with most cards and gain lore if Detective is in play", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: searchForClues.cost,
//         hand: [searchForClues],
//         play: [mickeyMouseDetective],
//         deck: 10,
//       },
//       {
//         hand: 3,
//         deck: 10,
//       },
//     );
//
//     await testEngine.playCard(searchForClues);
//
//     // Opponent has 3 cards, player one has 0 cards, so only opponent should discard + lore gain
//     expect(testEngine.stackLayers).toHaveLength(2); // 1 for opponent discard, 1 for lore gain
//   });
//
//   it("should not trigger when no players have cards in hand", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: searchForClues.cost,
//         hand: [searchForClues],
//         deck: 5,
//       },
//       {
//         deck: 5,
//       },
//     );
//
//     await testEngine.playCard(searchForClues);
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     expect(testEngine.getZonesCardCount("player_one").hand).toEqual(0);
//     expect(testEngine.getZonesCardCount("player_two").hand).toEqual(0);
//   });
//
//   it("should not gain lore when no Detective characters in play", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: searchForClues.cost,
//         hand: [searchForClues],
//         deck: 10,
//       },
//       {
//         hand: 3,
//         deck: 10,
//       },
//     );
//
//     const initialLore = testEngine.getPlayerLore("player_one");
//
//     await testEngine.playCard(searchForClues);
//
//     // Only opponent discard effect, no lore gain
//     expect(testEngine.stackLayers).toHaveLength(1);
//
//     // Opponent would discard here, but we're just checking lore wasn't gained
//     expect(testEngine.getPlayerLore("player_one")).toEqual(initialLore);
//   });
// });
//
