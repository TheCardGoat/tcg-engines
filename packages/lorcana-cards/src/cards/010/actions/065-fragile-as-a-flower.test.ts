// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyBraveLittleTailor,
//   minnieMouseBelovedPrincess,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { fragileAsAFlower } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Fragile As A Flower", () => {
//   it("Draw a card. Exert chosen character with cost 2 or less. They can't ready at the start of their next turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: fragileAsAFlower.cost,
//         hand: [fragileAsAFlower],
//       },
//       {
//         play: [minnieMouseBelovedPrincess, mickeyBraveLittleTailor],
//       },
//     );
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       fragileAsAFlower.id,
//     );
//     const targetCharacter = testEngine.getCardModel(minnieMouseBelovedPrincess);
//
//     expect(cardUnderTest.zone).toBe("hand");
//     expect(targetCharacter.zone).toBe("play");
//     expect(targetCharacter.ready).toBe(true);
//     expect(testEngine.getZonesCardCount().hand).toBe(1);
//
//     // Play the song and choose target
//     await testEngine.playCard(cardUnderTest, {
//       targets: [targetCharacter],
//     });
//
//     // Check that card was drawn
//     expect(testEngine.getZonesCardCount().hand).toBe(1); // Still 1 because we played the song but drew a new card
//
//     // Check that character was exerted
//     expect(targetCharacter.ready).toBe(false);
//
//     // Pass turn and verify character can't ready
//     await testEngine.passTurn();
//     expect(targetCharacter.ready).toBe(false);
//   });
// });
//
