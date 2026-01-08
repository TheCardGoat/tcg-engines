// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   cinderellaGentleAndKind,
//   mickeyMouseTrueFriend,
//   timonGrubRustler,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { ghostlyTale } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ghostly Tale", () => {
//   it("exerts all opposing characters with 2 or less strength", async () => {
//     // Arrange: Set up game with action in hand and opposing characters with low strength
//     const testEngine = new TestEngine(
//       {
//         inkwell: ghostlyTale.cost,
//         hand: [ghostlyTale],
//       },
//       {
//         play: [
//           timonGrubRustler, // Strength: 1
//           cinderellaGentleAndKind, // Strength: 2
//         ],
//       },
//     );
//
//     const timonInitial = testEngine.getCardModel(timonGrubRustler);
//     const cinderellaInitial = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     // Verify initial state
//     expect(timonInitial.strength).toBe(1);
//     expect(cinderellaInitial.strength).toBe(2);
//     expect(timonInitial.ready).toBe(true);
//     expect(cinderellaInitial.ready).toBe(true);
//
//     // Act: Play the action
//     await testEngine.playCard(ghostlyTale);
//
//     // Assert: Both characters should be exerted (strength 1 and 2)
//     const timonAfter = testEngine.getCardModel(timonGrubRustler);
//     const cinderellaAfter = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     expect(timonAfter.ready).toBe(false); // Timon should be exerted (strength 1)
//     expect(cinderellaAfter.ready).toBe(false); // Cinderella should be exerted (strength 2)
//     // Action should go to discard after use
//     expect(testEngine.getCardModel(ghostlyTale).zone).toBe("discard");
//   });
//
//   it("does not exert opposing characters with more than 2 strength", async () => {
//     // Arrange: Set up game with opposing characters with high strength
//     const testEngine = new TestEngine(
//       {
//         inkwell: ghostlyTale.cost,
//         hand: [ghostlyTale],
//       },
//       {
//         play: [mickeyMouseTrueFriend], // Strength: 3, above threshold
//       },
//     );
//
//     const mickeyInitial = testEngine.getCardModel(mickeyMouseTrueFriend);
//     expect(mickeyInitial.strength).toBe(3);
//     expect(mickeyInitial.ready).toBe(true);
//
//     // Act: Play the action
//     await testEngine.playCard(ghostlyTale);
//
//     // Assert: Character should NOT be exerted (strength 3 > 2)
//     const mickeyAfter = testEngine.getCardModel(mickeyMouseTrueFriend);
//     expect(mickeyAfter.ready).toBe(true); // Should remain ready (strength 3 > 2)
//     // Action should go to discard after use
//     expect(testEngine.getCardModel(ghostlyTale).zone).toBe("discard");
//   });
//
//   it("does not affect your own characters", async () => {
//     // Arrange: Set up game with your own characters
//     const testEngine = new TestEngine({
//       inkwell: ghostlyTale.cost,
//       hand: [ghostlyTale],
//       play: [timonGrubRustler], // Your character with low strength (1)
//     });
//
//     const yourCharacter = testEngine.getCardModel(timonGrubRustler);
//     expect(yourCharacter.ready).toBe(true);
//
//     // Act: Play the action
//     await testEngine.playCard(ghostlyTale);
//
//     // Assert: Your character should not be exerted
//     const yourCharacterAfter = testEngine.getCardModel(timonGrubRustler);
//     expect(yourCharacterAfter.ready).toBe(true); // Should remain ready (not exerted)
//     // Action should go to discard after use
//     expect(testEngine.getCardModel(ghostlyTale).zone).toBe("discard");
//   });
//
//   it("affects only opposing characters, not friendly characters in play", async () => {
//     // Arrange: Set up game with both friendly and opposing characters
//     const testEngine = new TestEngine(
//       {
//         inkwell: ghostlyTale.cost,
//         hand: [ghostlyTale],
//         play: [timonGrubRustler], // Your character with strength 1
//       },
//       {
//         play: [cinderellaGentleAndKind], // Opponent's character with strength 2
//       },
//     );
//
//     const yourCharacter = testEngine.getCardModel(timonGrubRustler);
//     const opponentCharacter = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     expect(yourCharacter.ready).toBe(true);
//     expect(opponentCharacter.ready).toBe(true);
//
//     // Act: Play the action
//     await testEngine.playCard(ghostlyTale);
//
//     // Assert: Only opponent's character should be exerted
//     expect(yourCharacter.ready).toBe(true); // Your character should remain ready
//     expect(opponentCharacter.ready).toBe(false); // Opponent's character should be exerted
//     // Action should go to discard after use
//     expect(testEngine.getCardModel(ghostlyTale).zone).toBe("discard");
//   });
// });
//
