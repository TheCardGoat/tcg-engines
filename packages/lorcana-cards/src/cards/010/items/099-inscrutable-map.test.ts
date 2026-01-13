// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { inscrutableMap } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Inscrutable Map", () => {
//   it("BACKTRACK , 1 — Chosen opposing character gets -1 lore until the start of your next turn.", async () => {
//     // Arrange: Set up the game with the item in play and an opposing character
//     const testEngine = new TestEngine(
//       {
//         inkwell: 1,
//         play: [inscrutableMap],
//       },
//       {
//         play: [mickeyBraveLittleTailor],
//       },
//     );
//
//     const item = testEngine.getCardModel(inscrutableMap);
//     const targetCharacter = testEngine.testStore.getByZoneAndId(
//       "play",
//       mickeyBraveLittleTailor.id,
//       "player_two",
//     );
//
//     // Store original lore
//     const originalLore = targetCharacter.lore;
//
//     // Act: Activate the BACKTRACK ability
//     item.activate("BACKTRACK");
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Assert: Character should have -1 lore
//     expect(targetCharacter.lore).toBe(originalLore - 1);
//
//     // Pass turn to end of player one's turn
//     testEngine.passTurn();
//
//     // Assert: Effect should still be active during opponent's turn
//     expect(targetCharacter.lore).toBe(originalLore - 1);
//
//     // Pass turn again - now it's the start of player one's next turn
//     testEngine.passTurn();
//
//     // Assert: Effect should be removed at the start of player one's next turn
//     expect(targetCharacter.lore).toBe(originalLore);
//   });
// });
//
