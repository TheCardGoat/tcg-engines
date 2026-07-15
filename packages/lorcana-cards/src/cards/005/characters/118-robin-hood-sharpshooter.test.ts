// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { breakFree } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import {
//   DaisyDuckSpotlessFoodfighter,
//   DenahiAvengingBrother,
//   PetePastryChomper,
//   RobinHoodSharpshooter,
//   SimbaAdventurousSuccessor,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Robin Hood - Sharpshooter", () => {
//   It("**MY GREATEST PERFORMANCE** Additional test with friends on the other side", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [robinHoodSharpshooter],
//         Deck: [
//           LiloGalacticHero,
//           SimbaAdventurousSuccessor,
//           BreakFree,
//           PetePastryChomper,
//           DenahiAvengingBrother,
//           DaisyDuckSpotlessFoodfighter,
//           FriendsOnTheOtherSide,
//         ],
//       },
//       { deck: 60 },
//     );
//
//     Const target = testEngine.getCardModel(friendsOnTheOtherSide);
//     Const otherCards = [
//       TestEngine.getCardModel(petePastryChomper),
//       TestEngine.getCardModel(denahiAvengingBrother),
//       TestEngine.getCardModel(daisyDuckSpotlessFoodfighter),
//     ];
//
//     Await testEngine.questCard(robinHoodSharpshooter);
//     Await testEngine.resolveTopOfStack(
//       {
//         Scry: {
//           Discard: otherCards,
//           Play: [target],
//         },
//       },
//       True,
//     );
//
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ hand: 0, deck: 60, discard: 0 }),
//     );
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 2, deck: 1, discard: 4 }),
//     );
//   });
// });
//
