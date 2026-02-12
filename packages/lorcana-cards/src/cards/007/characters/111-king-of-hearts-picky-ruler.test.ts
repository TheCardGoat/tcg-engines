// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { captainHookForcefulDuelist } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MadamMimFox,
//   MadamMimSnake,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { bellesHouseMauricesWorkshop } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import {
//   DenahiImpatientHunter,
//   KingOfHeartsPickyRuler,
// } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("King Of Hearts - Picky Ruler", () => {
//   It("OBJECTIONABLE STATE Damaged characters can't challenge your characters.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [
//           KingOfHeartsPickyRuler,
//           MrSmeeBumblingMate,
//           CaptainHookForcefulDuelist,
//           HiddenCoveTranquilHaven,
//         ],
//       },
//       {
//         Play: [madamMimFox, madamMimSnake],
//       },
//     );
//
//     Await testEngine.setCardDamage(madamMimFox, 1);
//
//     Await testEngine.tapCard(mrSmeeBumblingMate);
//     Await testEngine.tapCard(captainHookForcefulDuelist);
//
//     Await testEngine.challenge({
//       Attacker: madamMimFox,
//       Defender: mrSmeeBumblingMate,
//     });
//     Expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toBe(0);
//
//     Await testEngine.challenge({
//       Attacker: madamMimFox,
//       Defender: hiddenCoveTranquilHaven,
//     });
//     Expect(testEngine.getCardModel(hiddenCoveTranquilHaven).damage).toBe(4);
//
//     Await testEngine.challenge({
//       Attacker: madamMimSnake,
//       Defender: mrSmeeBumblingMate,
//     });
//     Expect(testEngine.getCardZone(mrSmeeBumblingMate)).toBe("discard");
//     Expect(testEngine.getCardZone(madamMimSnake)).toBe("discard");
//   });
// });
//
// Describe("Regression", () => {
//   It("Characters with Reckless affect by the effect should NOT prevent players passing the turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [denahiImpatientHunter],
//       },
//       {
//         Play: [kingOfHeartsPickyRuler],
//       },
//     );
//
//     Const denahi = testEngine.getCardModel(denahiImpatientHunter);
//     Const king = testEngine.getCardModel(kingOfHeartsPickyRuler);
//
//     Await testEngine.tapCard(kingOfHeartsPickyRuler);
//
//     Expect(denahi.canChallenge(king)).toBeTruthy();
//     Expect(denahi.hasChallengeCharactersRestriction).toBeFalsy();
//     Expect(denahi.hasChallengeRestriction).toBeFalsy();
//
//     Await testEngine.setCardDamage(denahiImpatientHunter, 1);
//
//     // Challenge restriction is only true when they're unable to challenge at all
//     Expect(denahi.hasChallengeRestriction).toBeFalsy();
//     Expect(denahi.hasChallengeCharactersRestriction).toBeTruthy();
//     Expect(denahi.canChallenge(king)).toBeFalsy();
//
//     Expect(testEngine.store.turnCount).toEqual(0);
//     Await testEngine.passTurn();
//     Expect(testEngine.store.turnCount).toEqual(1);
//   });
//
//   It("Characters with Reckless affect by the effect should prevent players passing the turn if there's location in play.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [denahiImpatientHunter],
//       },
//       {
//         Play: [kingOfHeartsPickyRuler, bellesHouseMauricesWorkshop],
//       },
//     );
//
//     Const denahi = testEngine.getCardModel(denahiImpatientHunter);
//     Const king = testEngine.getCardModel(kingOfHeartsPickyRuler);
//     Const location = testEngine.getCardModel(bellesHouseMauricesWorkshop);
//
//     Await testEngine.tapCard(kingOfHeartsPickyRuler);
//
//     Expect(denahi.canChallenge(king)).toBeTruthy();
//     Expect(denahi.hasChallengeCharactersRestriction).toBeFalsy();
//     Expect(denahi.hasChallengeRestriction).toBeFalsy();
//     Expect(denahi.canChallenge(location)).toBeTruthy();
//
//     Await testEngine.setCardDamage(denahiImpatientHunter, 1);
//
//     // Challenge restriction is only true when they're unable to challenge at all
//     Expect(denahi.hasChallengeRestriction).toBeFalsy();
//     Expect(denahi.hasChallengeCharactersRestriction).toBeTruthy();
//     Expect(denahi.canChallenge(king)).toBeFalsy();
//     Expect(denahi.canChallenge(location)).toBeTruthy();
//
//     Expect(testEngine.store.turnCount).toEqual(0);
//     Await testEngine.passTurn();
//     Expect(testEngine.store.turnCount).toEqual(0);
//   });
// });
//
