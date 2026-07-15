// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   StitchRockStar,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { iagoOutOfReach } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Iago - Out of Reach", () => {
//   It("SELF-PRESERVATION While you have another exerted character in play, this character can't be challenged.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [iagoOutOfReach, stitchRockStar],
//       },
//       {
//         Play: [liloGalacticHero],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(iagoOutOfReach);
//     Const challenger = testEngine.getCardModel(liloGalacticHero);
//
//     Await testEngine.tapCard(iagoOutOfReach);
//
//     // Check that Iago can be challenged
//     Expect(cardUnderTest.canBeChallenged(challenger)).toEqual(true);
//     Expect(challenger.canChallenge(cardUnderTest)).toEqual(true);
//
//     Await testEngine.tapCard(stitchRockStar);
//
//     // Check that Iago can't be challenged
//     Expect(cardUnderTest.canBeChallenged(challenger)).toEqual(false);
//     Expect(challenger.canChallenge(cardUnderTest)).toEqual(false);
//   });
// });
//
