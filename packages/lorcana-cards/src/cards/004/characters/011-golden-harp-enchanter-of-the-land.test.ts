// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { goldenHarpEnchanterOfTheLand } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Golden Harp - Enchanter of the Land", () => {
//   Describe("**STOLEN AWAY** At the end of your turn, if you didn't play a song this turn, banish this character.", () => {
//     It("should banish the character if no song was played this turn", async () => {
//       Const testEngine = new TestEngine({
//         Play: [goldenHarpEnchanterOfTheLand],
//       });
//
//       Await testEngine.passTurn();
//
//       Expect(testEngine.getCardModel(goldenHarpEnchanterOfTheLand).zone).toBe(
//         "discard",
//       );
//     });
//     It("should not banish the character if a song was played this turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [goldenHarpEnchanterOfTheLand],
//         Hand: [friendsOnTheOtherSide],
//       });
//
//       Await testEngine.playCard(friendsOnTheOtherSide);
//       Await testEngine.passTurn();
//
//       Expect(testEngine.getCardModel(goldenHarpEnchanterOfTheLand).zone).toBe(
//         "play",
//       );
//     });
//   });
// });
//
