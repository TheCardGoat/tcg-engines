// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyBraveLittleTailor,
//   MinnieMouseBelovedPrincess,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { fragileAsAFlower } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fragile As A Flower", () => {
//   It("Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: fragileAsAFlower.cost,
//         Hand: [fragileAsAFlower],
//       },
//       {
//         Play: [minnieMouseBelovedPrincess, mickeyBraveLittleTailor],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       FragileAsAFlower.id,
//     );
//     Const targetCharacter = testEngine.getCardModel(minnieMouseBelovedPrincess);
//
//     Expect(cardUnderTest.zone).toBe("hand");
//     Expect(targetCharacter.zone).toBe("play");
//     Expect(targetCharacter.ready).toBe(true);
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//
//     // Play the song and choose target
//     Await testEngine.playCard(cardUnderTest, {
//       Targets: [targetCharacter],
//     });
//
//     // Check that card was drawn
//     Expect(testEngine.getZonesCardCount().hand).toBe(1); // Still 1 because we played the song but drew a new card
//
//     // Check that character was exerted
//     Expect(targetCharacter.ready).toBe(false);
//
//     // Pass turn and verify character can't ready
//     Await testEngine.passTurn();
//     Expect(targetCharacter.ready).toBe(false);
//   });
// });
//
