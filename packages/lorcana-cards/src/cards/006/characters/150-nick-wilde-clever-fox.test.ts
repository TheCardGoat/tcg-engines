// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   MadHattersTeapot,
//   NickWildeCleverFox,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nick Wilde - Clever Fox", () => {
//   It("Shift 1 (You may pay 1 {I} to play this on top of one of your characters named Nick Wilde.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [nickWildeCleverFox],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(nickWildeCleverFox);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("CAN'T TOUCH ME While you have an item in play, this character can't be challenged.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: madHattersTeapot.cost,
//         Hand: [madHattersTeapot],
//         Play: [nickWildeCleverFox],
//       },
//       {
//         Play: [goofyKnightForADay],
//         Deck: 2,
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(nickWildeCleverFox);
//     Const challenger = testEngine.getCardModel(goofyKnightForADay);
//
//     Await testEngine.tapCard(nickWildeCleverFox);
//
//     Expect(cardUnderTest.canBeChallenged(challenger)).toEqual(true);
//     Expect(challenger.canChallenge(cardUnderTest)).toEqual(true);
//
//     Await testEngine.playCard(madHattersTeapot);
//
//     Expect(cardUnderTest.canBeChallenged(challenger)).toEqual(false);
//     Expect(challenger.canChallenge(cardUnderTest)).toEqual(false);
//   });
// });
//
