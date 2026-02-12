// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MauiDemiGod,
//   MauiHeroToAll,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { itCallsMe } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { moanaDeterminedExplorer } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { mauiHalfshark } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("It Calls Me", () => {
//   It("Draw a card. Shuffle up to 3 cards from your opponent’s discard into your opponent’s deck.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 1,
//         Hand: [itCallsMe],
//         Deck: [moanaDeterminedExplorer],
//       },
//       {
//         Inkwell: 1,
//         Hand: [],
//         Discard: [mauiHalfshark, mauiDemiGod, mauiHeroToAll],
//       },
//     );
//
//     Await testEngine.playCard(itCallsMe, {
//       Targets: [mauiDemiGod, mauiHeroToAll, mauiHalfshark],
//     });
//
//     Expect(testEngine.getCardModel(mauiHalfshark).zone).toBe("deck");
//     Expect(testEngine.getCardModel(mauiDemiGod).zone).toBe("deck");
//     Expect(testEngine.getCardModel(mauiHeroToAll).zone).toBe("deck");
//
//     Expect(testEngine.getCardModel(moanaDeterminedExplorer).zone).toBe("hand");
//   });
//
//   It("Still draws when opp has no cards in discard", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 1,
//         Hand: [itCallsMe],
//         Deck: [moanaDeterminedExplorer],
//       },
//       {
//         Deck: 10,
//         Hand: [],
//         Discard: [],
//       },
//     );
//
//     Await testEngine.playCard(itCallsMe);
//
//     Expect(testEngine.getCardModel(moanaDeterminedExplorer).zone).toBe("hand");
//   });
// });
//
