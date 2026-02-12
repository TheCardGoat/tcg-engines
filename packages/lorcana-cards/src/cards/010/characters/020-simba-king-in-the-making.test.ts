// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mufasaBetrayedLeader } from "@lorcanito/lorcana-engine/cards/002/characters/014-mufasa-betrayed-leader";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import {
//   InscrutableMap,
//   SimbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Simba - King in the Making", () => {
//   It("Boost 3 (Once during your turn, you may pay 3 to put the top card of your deck facedown under this character.) ", async () => {
//     Const testEngine = new TestEngine({
//       Play: [simbaKingInTheMaking],
//     });
//
//     Expect(testEngine.getCardModel(simbaKingInTheMaking).hasBoost).toBe(true);
//   });
//
//   Describe("TIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.", () => {
//     It("Top card is a character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [simbaKingInTheMaking],
//         Deck: [inscrutableMap, goofyKnightForADay, mufasaBetrayedLeader],
//       });
//
//       Await testEngine.activateCard(simbaKingInTheMaking);
//
//       Const boostedCard = testEngine.getCardModel(mufasaBetrayedLeader);
//       Const cardUnderTest = testEngine.getCardModel(simbaKingInTheMaking);
//
//       Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//       Expect(boostedCard.isUnder(cardUnderTest));
//
//       Const topDeckCard = testEngine.getCardModel(goofyKnightForADay);
//
//       Expect(topDeckCard.zone).toBe("deck");
//
//       // Accept TIMELY ALLIANCE optional ability
//       Await testEngine.acceptOptionalAbility();
//
//       // Resolve scry: choose to play the character
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: {
//             Play: [goofyKnightForADay],
//           },
//         },
//         True,
//       );
//
//       Expect(topDeckCard.zone).toBe("play");
//       Expect(topDeckCard.exerted).toBe(true);
//     });
//
//     It("Top card is NOT a character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [simbaKingInTheMaking],
//         Deck: [goofyKnightForADay, inscrutableMap, mufasaBetrayedLeader],
//       });
//
//       Await testEngine.activateCard(simbaKingInTheMaking);
//
//       Const boostedCard = testEngine.getCardModel(mufasaBetrayedLeader);
//       Const cardUnderTest = testEngine.getCardModel(simbaKingInTheMaking);
//
//       Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//       Expect(boostedCard.isUnder(cardUnderTest));
//
//       Const topDeckCard = testEngine.getCardModel(inscrutableMap);
//
//       Expect(topDeckCard.zone).toBe("deck");
//
//       // Accept TIMELY ALLIANCE optional ability
//       Await testEngine.acceptOptionalAbility();
//
//       // Resolve scry: inscrutableMap is not a character, so put it on bottom
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: {
//             Bottom: [inscrutableMap],
//           },
//         },
//         True,
//       );
//
//       Expect(topDeckCard.zone).toBe("deck");
//     });
//   });
// });
//
