// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mufasaBetrayedLeader } from "@lorcanito/lorcana-engine/cards/002/characters/014-mufasa-betrayed-leader";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import {
//   BeastAggressiveLord,
//   WebbysDiary,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Webby's Diary", () => {
//   It("LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 4,
//       Play: [beastAggressiveLord, webbysDiary],
//       // Using 3 cards in deck so we can track the draw
//       Deck: [mufasaBetrayedLeader, goofyKnightForADay, mufasaBetrayedLeader],
//     });
//
//     Const booster = testEngine.getCardModel(beastAggressiveLord);
//
//     Await testEngine.activateCard(beastAggressiveLord);
//
//     Expect(booster.cardsUnder).toHaveLength(1);
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ deck: 2 }),
//     );
//
//     // Accept Webby's Diary LATEST ENTRY trigger (will draw a card for 1 ink)
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ deck: 1, hand: 1, play: 2 }),
//     );
//   });
// });
//
