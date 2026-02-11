// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CinderellaGentleAndKind,
//   MickeyMouseTrueFriend,
//   TimonGrubRustler,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { ghostlyTale } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ghostly Tale", () => {
//   It("exerts all opposing characters with 2 or less strength", async () => {
//     // Arrange: Set up game with action in hand and opposing characters with low strength
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ghostlyTale.cost,
//         Hand: [ghostlyTale],
//       },
//       {
//         Play: [
//           TimonGrubRustler, // Strength: 1
//           CinderellaGentleAndKind, // Strength: 2
//         ],
//       },
//     );
//
//     Const timonInitial = testEngine.getCardModel(timonGrubRustler);
//     Const cinderellaInitial = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     // Verify initial state
//     Expect(timonInitial.strength).toBe(1);
//     Expect(cinderellaInitial.strength).toBe(2);
//     Expect(timonInitial.ready).toBe(true);
//     Expect(cinderellaInitial.ready).toBe(true);
//
//     // Act: Play the action
//     Await testEngine.playCard(ghostlyTale);
//
//     // Assert: Both characters should be exerted (strength 1 and 2)
//     Const timonAfter = testEngine.getCardModel(timonGrubRustler);
//     Const cinderellaAfter = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     Expect(timonAfter.ready).toBe(false); // Timon should be exerted (strength 1)
//     Expect(cinderellaAfter.ready).toBe(false); // Cinderella should be exerted (strength 2)
//     // Action should go to discard after use
//     Expect(testEngine.getCardModel(ghostlyTale).zone).toBe("discard");
//   });
//
//   It("does not exert opposing characters with more than 2 strength", async () => {
//     // Arrange: Set up game with opposing characters with high strength
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ghostlyTale.cost,
//         Hand: [ghostlyTale],
//       },
//       {
//         Play: [mickeyMouseTrueFriend], // Strength: 3, above threshold
//       },
//     );
//
//     Const mickeyInitial = testEngine.getCardModel(mickeyMouseTrueFriend);
//     Expect(mickeyInitial.strength).toBe(3);
//     Expect(mickeyInitial.ready).toBe(true);
//
//     // Act: Play the action
//     Await testEngine.playCard(ghostlyTale);
//
//     // Assert: Character should NOT be exerted (strength 3 > 2)
//     Const mickeyAfter = testEngine.getCardModel(mickeyMouseTrueFriend);
//     Expect(mickeyAfter.ready).toBe(true); // Should remain ready (strength 3 > 2)
//     // Action should go to discard after use
//     Expect(testEngine.getCardModel(ghostlyTale).zone).toBe("discard");
//   });
//
//   It("does not affect your own characters", async () => {
//     // Arrange: Set up game with your own characters
//     Const testEngine = new TestEngine({
//       Inkwell: ghostlyTale.cost,
//       Hand: [ghostlyTale],
//       Play: [timonGrubRustler], // Your character with low strength (1)
//     });
//
//     Const yourCharacter = testEngine.getCardModel(timonGrubRustler);
//     Expect(yourCharacter.ready).toBe(true);
//
//     // Act: Play the action
//     Await testEngine.playCard(ghostlyTale);
//
//     // Assert: Your character should not be exerted
//     Const yourCharacterAfter = testEngine.getCardModel(timonGrubRustler);
//     Expect(yourCharacterAfter.ready).toBe(true); // Should remain ready (not exerted)
//     // Action should go to discard after use
//     Expect(testEngine.getCardModel(ghostlyTale).zone).toBe("discard");
//   });
//
//   It("affects only opposing characters, not friendly characters in play", async () => {
//     // Arrange: Set up game with both friendly and opposing characters
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ghostlyTale.cost,
//         Hand: [ghostlyTale],
//         Play: [timonGrubRustler], // Your character with strength 1
//       },
//       {
//         Play: [cinderellaGentleAndKind], // Opponent's character with strength 2
//       },
//     );
//
//     Const yourCharacter = testEngine.getCardModel(timonGrubRustler);
//     Const opponentCharacter = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     Expect(yourCharacter.ready).toBe(true);
//     Expect(opponentCharacter.ready).toBe(true);
//
//     // Act: Play the action
//     Await testEngine.playCard(ghostlyTale);
//
//     // Assert: Only opponent's character should be exerted
//     Expect(yourCharacter.ready).toBe(true); // Your character should remain ready
//     Expect(opponentCharacter.ready).toBe(false); // Opponent's character should be exerted
//     // Action should go to discard after use
//     Expect(testEngine.getCardModel(ghostlyTale).zone).toBe("discard");
//   });
// });
//
