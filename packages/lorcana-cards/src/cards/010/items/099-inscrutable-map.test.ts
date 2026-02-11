// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { inscrutableMap } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Inscrutable Map", () => {
//   It("BACKTRACK , 1 — Chosen opposing character gets -1 lore until the start of your next turn.", async () => {
//     // Arrange: Set up the game with the item in play and an opposing character
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 1,
//         Play: [inscrutableMap],
//       },
//       {
//         Play: [mickeyBraveLittleTailor],
//       },
//     );
//
//     Const item = testEngine.getCardModel(inscrutableMap);
//     Const targetCharacter = testEngine.testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//       "player_two",
//     );
//
//     // Store original lore
//     Const originalLore = targetCharacter.lore;
//
//     // Act: Activate the BACKTRACK ability
//     Item.activate("BACKTRACK");
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Assert: Character should have -1 lore
//     Expect(targetCharacter.lore).toBe(originalLore - 1);
//
//     // Pass turn to end of player one's turn
//     TestEngine.passTurn();
//
//     // Assert: Effect should still be active during opponent's turn
//     Expect(targetCharacter.lore).toBe(originalLore - 1);
//
//     // Pass turn again - now it's the start of player one's next turn
//     TestEngine.passTurn();
//
//     // Assert: Effect should be removed at the start of player one's next turn
//     Expect(targetCharacter.lore).toBe(originalLore);
//   });
// });
//
