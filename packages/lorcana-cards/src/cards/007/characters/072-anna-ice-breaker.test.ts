// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnnaIceBreaker,
//   DoloresMadrigalWithinEarshot,
//   DonaldDuckFlusteredSorcerer,
//   TheQueenJealousBeauty,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Anna - Ice Breaker", () => {
//   It("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [annaIceBreaker],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(annaIceBreaker);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It("WINTER AMBUSH When you play this character, chosen opposing character can’t ready at the start of their next turn.", async () => {
//     Const play = [
//       DonaldDuckFlusteredSorcerer,
//       TheQueenJealousBeauty,
//       DoloresMadrigalWithinEarshot,
//     ];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: annaIceBreaker.cost,
//         Hand: [annaIceBreaker],
//         Deck: 5,
//       },
//       {
//         Play: play,
//         Deck: 5,
//       },
//     );
//
//     For (const card of play) {
//       Await testEngine.tapCard(card);
//     }
//
//     Await testEngine.playCard(annaIceBreaker, {
//       Targets: [doloresMadrigalWithinEarshot],
//     });
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(doloresMadrigalWithinEarshot).exerted).toBe(
//       True,
//     );
//   });
// });
//
