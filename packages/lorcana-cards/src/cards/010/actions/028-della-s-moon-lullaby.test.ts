// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   herculesTrueHero,
//   mickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { dellasMoonLullaby } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Della's Moon Lullaby", () => {
//   it("Chosen opposing character gets -2 strength until the start of your next turn and draw a card", async () => {
//     // Arrange: Set up the game with the action in hand and an opposing character
//     const testEngine = new TestEngine(
//       {
//         inkwell: dellasMoonLullaby.cost,
//         hand: [dellasMoonLullaby],
//         deck: 5,
//       },
//       {
//         play: [mickeyBraveLittleTailor], // Target character (strength: 5)
//       },
//     );
//
//     const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     // Act: Play the action card
//     await testEngine.playCard(dellasMoonLullaby, {
//       targets: [mickeyBraveLittleTailor],
//     });
//
//     // Assert: Verify card was drawn (action card was discarded, but we drew 1 card)
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: 1, // Drew 1 card, action was discarded
//         deck: initialDeckCount - 1,
//         discard: 1, // Action card in discard
//       }),
//     );
//
//     // Assert: Character should have -2 strength from continuous effect
//     const targetCard = testEngine.testStore.getByZoneAndId(
//       "play",
//       mickeyBraveLittleTailor.id,
//       "player_two",
//     );
//     expect(targetCard.strength).toBe(3); // 5 - 2 = 3
//
//     // Pass turn to opponent's turn - effect should still be active
//     testEngine.passTurn();
//     const targetAfterPass1 = testEngine.testStore.getByZoneAndId(
//       "play",
//       mickeyBraveLittleTailor.id,
//       "player_two",
//     );
//     expect(targetAfterPass1.strength).toBe(3);
//
//     // Pass turn back - effect expires at start of player one's next turn
//     testEngine.passTurn();
//     const targetAfterPass2 = testEngine.testStore.getByZoneAndId(
//       "play",
//       mickeyBraveLittleTailor.id,
//       "player_two",
//     );
//     expect(targetAfterPass2.strength).toBe(5); // Back to original
//   });
// });
//
