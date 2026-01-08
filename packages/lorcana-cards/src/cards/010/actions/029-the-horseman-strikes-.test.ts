// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { genieOnTheJob } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { theHorsemanStrikes } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe.skip("The Horseman Strikes!", () => {
//   it("draws a card when played", async () => {
//     // Arrange: Set up the game with the action in hand
//     const testEngine = new TestEngine({
//       inkwell: theHorsemanStrikes.cost,
//       hand: [theHorsemanStrikes],
//       deck: 5,
//     });
//
//     const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action card
//     await testEngine.playCard(theHorsemanStrikes);
//
//     // Assert: Verify card was drawn
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: 1, // Drew 1 card, action was discarded
//         deck: initialDeckCount - 1,
//         discard: 1, // Action card in discard
//       }),
//     );
//   });
//
//   it("allows banishing a character with evasive", async () => {
//     // Arrange: Set up the game with the action in hand and an opposing character with evasive
//     const testEngine = new TestEngine(
//       {
//         inkwell: theHorsemanStrikes.cost,
//         hand: [theHorsemanStrikes],
//         deck: 5,
//       },
//       {
//         play: [genieOnTheJob], // Genie has Evasive
//       },
//     );
//
//     const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action card and target Genie
//     await testEngine.playCard(theHorsemanStrikes, {
//       targets: [genieOnTheJob],
//     });
//
//     // Assert: Verify card was drawn and Genie was banished
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: 1, // Drew 1 card, action was discarded
//         deck: initialDeckCount - 1,
//         discard: 1, // Action card in discard
//       }),
//     );
//
//     // Assert: Genie should be banished (no cards should be in play for player_two)
//     const playerTwoPlayZone =
//       testEngine.testStore.store.tableStore.getPlayerZone("player_two", "play");
//     expect(playerTwoPlayZone?.cards).toHaveLength(0); // No cards in play zone
//   });
//
//   it("resolves correctly even when no valid targets exist", async () => {
//     // Arrange: Set up the game with the action in hand but no opposing characters
//     const testEngine = new TestEngine({
//       inkwell: theHorsemanStrikes.cost,
//       hand: [theHorsemanStrikes],
//       deck: 5,
//     });
//
//     const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action card
//     await testEngine.playCard(theHorsemanStrikes);
//
//     // Assert: Should still draw a card even if no valid banish targets
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: 1, // Drew 1 card, action was discarded
//         deck: initialDeckCount - 1,
//         discard: 1, // Action card in discard
//       }),
//     );
//   });
// });
//
