// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { genieOnTheJob } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { theHorsemanStrikes } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe.skip("The Horseman Strikes!", () => {
//   It("draws a card when played", async () => {
//     // Arrange: Set up the game with the action in hand
//     Const testEngine = new TestEngine({
//       Inkwell: theHorsemanStrikes.cost,
//       Hand: [theHorsemanStrikes],
//       Deck: 5,
//     });
//
//     Const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action card
//     Await testEngine.playCard(theHorsemanStrikes);
//
//     // Assert: Verify card was drawn
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1, // Drew 1 card, action was discarded
//         Deck: initialDeckCount - 1,
//         Discard: 1, // Action card in discard
//       }),
//     );
//   });
//
//   It("allows banishing a character with evasive", async () => {
//     // Arrange: Set up the game with the action in hand and an opposing character with evasive
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: theHorsemanStrikes.cost,
//         Hand: [theHorsemanStrikes],
//         Deck: 5,
//       },
//       {
//         Play: [genieOnTheJob], // Genie has Evasive
//       },
//     );
//
//     Const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action card and target Genie
//     Await testEngine.playCard(theHorsemanStrikes, {
//       Targets: [genieOnTheJob],
//     });
//
//     // Assert: Verify card was drawn and Genie was banished
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1, // Drew 1 card, action was discarded
//         Deck: initialDeckCount - 1,
//         Discard: 1, // Action card in discard
//       }),
//     );
//
//     // Assert: Genie should be banished (no cards should be in play for player_two)
//     Const playerTwoPlayZone =
//       TestEngine.testStore.store.tableStore.getPlayerZone("player_two", "play");
//     Expect(playerTwoPlayZone?.cards).toHaveLength(0); // No cards in play zone
//   });
//
//   It("resolves correctly even when no valid targets exist", async () => {
//     // Arrange: Set up the game with the action in hand but no opposing characters
//     Const testEngine = new TestEngine({
//       Inkwell: theHorsemanStrikes.cost,
//       Hand: [theHorsemanStrikes],
//       Deck: 5,
//     });
//
//     Const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action card
//     Await testEngine.playCard(theHorsemanStrikes);
//
//     // Assert: Should still draw a card even if no valid banish targets
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1, // Drew 1 card, action was discarded
//         Deck: initialDeckCount - 1,
//         Discard: 1, // Action card in discard
//       }),
//     );
//   });
// });
//
