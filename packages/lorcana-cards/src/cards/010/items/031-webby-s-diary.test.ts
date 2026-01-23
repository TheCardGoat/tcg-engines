// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mufasaBetrayedLeader } from "@lorcanito/lorcana-engine/cards/002/characters/014-mufasa-betrayed-leader";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import {
//   beastAggressiveLord,
//   webbysDiary,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Webby's Diary", () => {
//   it("LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 4,
//       play: [beastAggressiveLord, webbysDiary],
//       // Using 3 cards in deck so we can track the draw
//       deck: [mufasaBetrayedLeader, goofyKnightForADay, mufasaBetrayedLeader],
//     });
//
//     const booster = testEngine.getCardModel(beastAggressiveLord);
//
//     await testEngine.activateCard(beastAggressiveLord);
//
//     expect(booster.cardsUnder).toHaveLength(1);
//
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({ deck: 2 }),
//     );
//
//     // Accept Webby's Diary LATEST ENTRY trigger (will draw a card for 1 ink)
//     await testEngine.acceptOptionalLayer();
//
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({ deck: 1, hand: 1, play: 2 }),
//     );
//   });
// });
//
