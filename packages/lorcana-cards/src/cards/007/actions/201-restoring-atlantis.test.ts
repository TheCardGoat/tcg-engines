// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnastasiaBossyStepsister,
//   ElsaTrustedSister,
//   MufasaRespectedKing,
//   RestoringAtlantis,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Restoring Atlantis", () => {
//   It("Your characters can't be challenged until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: restoringAtlantis.cost,
//         Play: [anastasiaBossyStepsister, elsaTrustedSister],
//         Hand: [restoringAtlantis],
//       },
//       {
//         Deck: 3,
//         Play: [mufasaRespectedKing],
//       },
//     );
//
//     Await testEngine.playCard(restoringAtlantis);
//
//     Await testEngine.passTurn();
//
//     Await testEngine.tapCard(anastasiaBossyStepsister);
//     Await testEngine.tapCard(elsaTrustedSister);
//
//     Const attacker = testEngine.getCardModel(mufasaRespectedKing);
//     Expect(
//       Attacker.canChallenge(testEngine.getCardModel(anastasiaBossyStepsister)),
//     ).toBe(false);
//     Expect(
//       Attacker.canChallenge(testEngine.getCardModel(elsaTrustedSister)),
//     ).toBe(false);
//   });
// });
//
