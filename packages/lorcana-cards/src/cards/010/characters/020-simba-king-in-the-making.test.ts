// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mufasaBetrayedLeader } from "@lorcanito/lorcana-engine/cards/002/characters/014-mufasa-betrayed-leader";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import {
//   inscrutableMap,
//   simbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Simba - King in the Making", () => {
//   it("Boost 3 (Once during your turn, you may pay 3 to put the top card of your deck facedown under this character.) ", async () => {
//     const testEngine = new TestEngine({
//       play: [simbaKingInTheMaking],
//     });
//
//     expect(testEngine.getCardModel(simbaKingInTheMaking).hasBoost).toBe(true);
//   });
//
//   describe("TIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.", () => {
//     it("Top card is a character", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3,
//         play: [simbaKingInTheMaking],
//         deck: [inscrutableMap, goofyKnightForADay, mufasaBetrayedLeader],
//       });
//
//       await testEngine.activateCard(simbaKingInTheMaking);
//
//       const boostedCard = testEngine.getCardModel(mufasaBetrayedLeader);
//       const cardUnderTest = testEngine.getCardModel(simbaKingInTheMaking);
//
//       expect(cardUnderTest.cardsUnder).toHaveLength(1);
//       expect(boostedCard.isUnder(cardUnderTest));
//
//       const topDeckCard = testEngine.getCardModel(goofyKnightForADay);
//
//       expect(topDeckCard.zone).toBe("deck");
//
//       // Accept TIMELY ALLIANCE optional ability
//       await testEngine.acceptOptionalAbility();
//
//       // Resolve scry: choose to play the character
//       await testEngine.resolveTopOfStack(
//         {
//           scry: {
//             play: [goofyKnightForADay],
//           },
//         },
//         true,
//       );
//
//       expect(topDeckCard.zone).toBe("play");
//       expect(topDeckCard.exerted).toBe(true);
//     });
//
//     it("Top card is NOT a character", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 3,
//         play: [simbaKingInTheMaking],
//         deck: [goofyKnightForADay, inscrutableMap, mufasaBetrayedLeader],
//       });
//
//       await testEngine.activateCard(simbaKingInTheMaking);
//
//       const boostedCard = testEngine.getCardModel(mufasaBetrayedLeader);
//       const cardUnderTest = testEngine.getCardModel(simbaKingInTheMaking);
//
//       expect(cardUnderTest.cardsUnder).toHaveLength(1);
//       expect(boostedCard.isUnder(cardUnderTest));
//
//       const topDeckCard = testEngine.getCardModel(inscrutableMap);
//
//       expect(topDeckCard.zone).toBe("deck");
//
//       // Accept TIMELY ALLIANCE optional ability
//       await testEngine.acceptOptionalAbility();
//
//       // Resolve scry: inscrutableMap is not a character, so put it on bottom
//       await testEngine.resolveTopOfStack(
//         {
//           scry: {
//             bottom: [inscrutableMap],
//           },
//         },
//         true,
//       );
//
//       expect(topDeckCard.zone).toBe("deck");
//     });
//   });
// });
//
