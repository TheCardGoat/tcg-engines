// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HerculesTrueHero,
//   MickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { dellasMoonLullaby } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Della's Moon Lullaby", () => {
//   It("Chosen opposing character gets -2 strength until the start of your next turn and draw a card", async () => {
//     // Arrange: Set up the game with the action in hand and an opposing character
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: dellasMoonLullaby.cost,
//         Hand: [dellasMoonLullaby],
//         Deck: 5,
//       },
//       {
//         Play: [mickeyBraveLittleTailor], // Target character (strength: 5)
//       },
//     );
//
//     Const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action card
//     Await testEngine.playCard(dellasMoonLullaby, {
//       Targets: [mickeyBraveLittleTailor],
//     });
//
//     // Assert: Verify card was drawn (action card was discarded, but we drew 1 card)
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1, // Drew 1 card, action was discarded
//         Deck: initialDeckCount - 1,
//         Discard: 1, // Action card in discard
//       }),
//     );
//
//     // Assert: Character should have -2 strength from continuous effect
//     Const targetCard = testEngine.testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//       "player_two",
//     );
//     Expect(targetCard.strength).toBe(3); // 5 - 2 = 3
//
//     // Pass turn to opponent's turn - effect should still be active
//     TestEngine.passTurn();
//     Const targetAfterPass1 = testEngine.testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//       "player_two",
//     );
//     Expect(targetAfterPass1.strength).toBe(3);
//
//     // Pass turn back - effect expires at start of player one's next turn
//     TestEngine.passTurn();
//     Const targetAfterPass2 = testEngine.testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//       "player_two",
//     );
//     Expect(targetAfterPass2.strength).toBe(5); // Back to original
//   });
// });
//
