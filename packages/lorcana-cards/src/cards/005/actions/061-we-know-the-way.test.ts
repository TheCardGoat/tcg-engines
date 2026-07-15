// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   LiloMakingAWish,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { rapunzelAppreciativeArtist } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { weKnowTheWay } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { liloEscapeArtist } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("We Know The Way", () => {
//   Describe("Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.", () => {
//     It("Revealed card has the same name as the chosen card", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: weKnowTheWay.cost,
//         Hand: [weKnowTheWay],
//         Discard: [liloJuniorCakeDecorator],
//         Deck: [liloGalacticHero, liloMakingAWish],
//       });
//
//       Await testEngine.playCard(
//         WeKnowTheWay,
//         { targets: [liloJuniorCakeDecorator] },
//         True,
//       );
//
//       Expect(testEngine.getCardModel(liloJuniorCakeDecorator).zone).toEqual(
//         "deck",
//       );
//
//       Const topDeckCard = testEngine.store.topDeckCard("player_one");
//       Expect(topDeckCard?.isRevealed).toEqual(true);
//
//       Expect(topDeckCard?.zone).toEqual("deck");
//       Await testEngine.acceptOptionalLayer();
//       Expect(topDeckCard?.zone).toEqual("play");
//     });
//
//     // Flaky test, sometimes the top card is not the same as the one in discard SKipping for now
//     It.skip("Revealed card DOES NOT have the same name as the chosen card", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: weKnowTheWay.cost,
//         Hand: [weKnowTheWay],
//         Discard: [rapunzelAppreciativeArtist],
//         Deck: [
//           LiloGalacticHero,
//           LiloMakingAWish,
//           LiloJuniorCakeDecorator,
//           LiloEscapeArtist,
//           LiloGalacticHero,
//           LiloMakingAWish,
//           LiloJuniorCakeDecorator,
//           LiloEscapeArtist,
//         ],
//       });
//
//       Const cardInDiscard = testEngine.getCardModel(rapunzelAppreciativeArtist);
//
//       Await testEngine.playCard(
//         WeKnowTheWay,
//         { targets: [cardInDiscard] },
//         True,
//       );
//
//       Expect(cardInDiscard.zone).toEqual("deck");
//
//       Const topDeckCard = testEngine.store.topDeckCard("player_one");
//
//       If (topDeckCard?.instanceId === cardInDiscard.instanceId) {
//         Throw new Error(
//           "Random card was chosen from the deck, is the same as the one in discard",
//         );
//       }
//
//       Expect(topDeckCard?.isRevealed).toEqual(true);
//
//       Expect(topDeckCard?.zone).toEqual("deck");
//       Await testEngine.acceptOptionalLayer();
//       Expect(topDeckCard?.zone).toEqual("hand");
//     });
//   });
// });
//
