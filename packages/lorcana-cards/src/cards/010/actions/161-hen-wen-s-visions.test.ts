// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielSpectacularSinger,
//   GoofyDaredevil,
//   HerculesTrueHero,
//   MickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { henWensVisions } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hen Wen's Visions", () => {
//   Describe("Basic functionality", () => {
//     It("looks at top 4 cards and puts exactly 1 on top, rest on bottom", async () => {
//       Const testEngine = new TestEngine({
//         Deck: [
//           MickeyBraveLittleTailor,
//           HerculesTrueHero,
//           GoofyDaredevil,
//           ArielSpectacularSinger,
//         ],
//         Inkwell: henWensVisions.cost,
//         Hand: [henWensVisions],
//       });
//
//       Await testEngine.playCard(henWensVisions);
//
//       // Get the actual cards from the deck after playing
//       Const deckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       Expect(deckCards.length).toBe(4);
//
//       // Get the cards we expect to work with
//       Const cardsToScry = deckCards.slice(0, 4);
//
//       // Resolve scry: put 1 card on top, rest on bottom
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Top: [cardsToScry[0]!], // Put first card on top
//           Bottom: [cardsToScry[1]!, cardsToScry[2]!, cardsToScry[3]!], // Rest on bottom
//         },
//       });
//
//       // All cards should still be in deck after scry
//       Const finalDeckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       Expect(finalDeckCards.length).toBe(4);
//
//       // Verify all original cards are still in deck
//       Expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
//         "deck",
//       );
//       Expect(testEngine.getCardModel(herculesTrueHero).zone).toBe("deck");
//       Expect(testEngine.getCardModel(goofyDaredevil).zone).toBe("deck");
//       Expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe("deck");
//     });
//
//     It("triggers scry effect when played", async () => {
//       Const testEngine = new TestEngine({
//         Deck: [
//           MickeyBraveLittleTailor,
//           HerculesTrueHero,
//           GoofyDaredevil,
//           ArielSpectacularSinger,
//         ],
//         Inkwell: henWensVisions.cost,
//         Hand: [henWensVisions],
//       });
//
//       Await testEngine.playCard(henWensVisions);
//
//       // Get the actual cards from the deck after playing
//       Const deckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       Const cardsToScry = deckCards.slice(0, 4);
//
//       // Resolve scry with different configuration
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Top: [cardsToScry[1]!],
//           Bottom: [cardsToScry[0]!, cardsToScry[2]!, cardsToScry[3]!],
//         },
//       });
//
//       // All cards should still be in deck after scry
//       Expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
//         "deck",
//       );
//       Expect(testEngine.getCardModel(herculesTrueHero).zone).toBe("deck");
//       Expect(testEngine.getCardModel(goofyDaredevil).zone).toBe("deck");
//       Expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe("deck");
//
//       Const finalDeckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       Expect(finalDeckCards.length).toBe(4);
//     });
//   });
//
//   Describe("Edge cases", () => {
//     It("moves card to discard after being played", async () => {
//       Const testEngine = new TestEngine({
//         Deck: [
//           MickeyBraveLittleTailor,
//           HerculesTrueHero,
//           GoofyDaredevil,
//           ArielSpectacularSinger,
//         ],
//         Inkwell: henWensVisions.cost,
//         Hand: [henWensVisions],
//       });
//
//       Await testEngine.playCard(henWensVisions);
//
//       // Card should be in discard pile after being played
//       Expect(testEngine.getCardModel(henWensVisions).zone).toBe("discard");
//
//       // Get the actual cards from the deck after playing
//       Const deckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       Const cardsToScry = deckCards.slice(0, 4);
//
//       // Resolve the scry effect
//       Await testEngine.resolveTopOfStack({
//         Scry: {
//           Top: [cardsToScry[0]!],
//           Bottom: [cardsToScry[1]!, cardsToScry[2]!, cardsToScry[3]!],
//         },
//       });
//     });
//
//     It("can be played with correct ink cost", async () => {
//       Const testEngine = new TestEngine({
//         Deck: [
//           MickeyBraveLittleTailor,
//           HerculesTrueHero,
//           GoofyDaredevil,
//           ArielSpectacularSinger,
//         ],
//         Inkwell: henWensVisions.cost, // Exactly enough ink
//         Hand: [henWensVisions],
//       });
//
//       Await testEngine.playCard(henWensVisions);
//       // If we get here without throwing, the card can be played
//
//       // Card should be in discard pile after being played
//       Expect(testEngine.getCardModel(henWensVisions).zone).toBe("discard");
//     });
//   });
//
//   Describe("Card properties", () => {
//     It("has correct card properties", () => {
//       Expect(henWensVisions.name).toBe("Hen Wen's Visions");
//       Expect(henWensVisions.type).toBe("action");
//       Expect(henWensVisions.colors).toEqual(["sapphire"]);
//       Expect(henWensVisions.cost).toBe(1);
//       Expect(henWensVisions.inkwell).toBe(true);
//       Expect(henWensVisions.set).toBe("010");
//       Expect(henWensVisions.number).toBe(161);
//       Expect(henWensVisions.rarity).toBe("common");
//       Expect(henWensVisions.characteristics).toEqual(["action"]);
//     });
//
//     It("has correct ability structure", () => {
//       Expect(henWensVisions.abilities).toHaveLength(1);
//       Expect(henWensVisions.abilities![0]!.type).toBe("resolution");
//
//       Const effects = henWensVisions.abilities![0]!.effects!;
//       Expect(effects).toHaveLength(1);
//       Expect((effects[0]! as any).type).toBe("scry");
//       Expect((effects[0]! as any).amount).toBe(4);
//       Expect((effects[0]! as any).mode).toBe("both");
//
//       Const limits = (effects[0]! as any).limits;
//       Expect(limits.top).toBe(1);
//       Expect(limits.bottom).toBe(3);
//       Expect(limits.inkwell).toBe(0);
//       Expect(limits.hand).toBe(0);
//
//       Expect((effects[0]! as any).target.type).toBe("player");
//       Expect((effects[0]! as any).target.value).toBe("self");
//     });
//
//     It("has correct card text", () => {
//       Expect(henWensVisions.text).toBe(
//         "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.",
//       );
//
//       Expect(henWensVisions.abilities![0]!.text).toBe(
//         "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.",
//       );
//     });
//   });
// });
//
