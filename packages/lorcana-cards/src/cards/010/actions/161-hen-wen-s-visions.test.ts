// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   arielSpectacularSinger,
//   goofyDaredevil,
//   herculesTrueHero,
//   mickeyBraveLittleTailor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { henWensVisions } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hen Wen's Visions", () => {
//   describe("Basic functionality", () => {
//     it("looks at top 4 cards and puts exactly 1 on top, rest on bottom", async () => {
//       const testEngine = new TestEngine({
//         deck: [
//           mickeyBraveLittleTailor,
//           herculesTrueHero,
//           goofyDaredevil,
//           arielSpectacularSinger,
//         ],
//         inkwell: henWensVisions.cost,
//         hand: [henWensVisions],
//       });
//
//       await testEngine.playCard(henWensVisions);
//
//       // Get the actual cards from the deck after playing
//       const deckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       expect(deckCards.length).toBe(4);
//
//       // Get the cards we expect to work with
//       const cardsToScry = deckCards.slice(0, 4);
//
//       // Resolve scry: put 1 card on top, rest on bottom
//       await testEngine.resolveTopOfStack({
//         scry: {
//           top: [cardsToScry[0]!], // Put first card on top
//           bottom: [cardsToScry[1]!, cardsToScry[2]!, cardsToScry[3]!], // Rest on bottom
//         },
//       });
//
//       // All cards should still be in deck after scry
//       const finalDeckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       expect(finalDeckCards.length).toBe(4);
//
//       // Verify all original cards are still in deck
//       expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
//         "deck",
//       );
//       expect(testEngine.getCardModel(herculesTrueHero).zone).toBe("deck");
//       expect(testEngine.getCardModel(goofyDaredevil).zone).toBe("deck");
//       expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe("deck");
//     });
//
//     it("triggers scry effect when played", async () => {
//       const testEngine = new TestEngine({
//         deck: [
//           mickeyBraveLittleTailor,
//           herculesTrueHero,
//           goofyDaredevil,
//           arielSpectacularSinger,
//         ],
//         inkwell: henWensVisions.cost,
//         hand: [henWensVisions],
//       });
//
//       await testEngine.playCard(henWensVisions);
//
//       // Get the actual cards from the deck after playing
//       const deckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       const cardsToScry = deckCards.slice(0, 4);
//
//       // Resolve scry with different configuration
//       await testEngine.resolveTopOfStack({
//         scry: {
//           top: [cardsToScry[1]!],
//           bottom: [cardsToScry[0]!, cardsToScry[2]!, cardsToScry[3]!],
//         },
//       });
//
//       // All cards should still be in deck after scry
//       expect(testEngine.getCardModel(mickeyBraveLittleTailor).zone).toBe(
//         "deck",
//       );
//       expect(testEngine.getCardModel(herculesTrueHero).zone).toBe("deck");
//       expect(testEngine.getCardModel(goofyDaredevil).zone).toBe("deck");
//       expect(testEngine.getCardModel(arielSpectacularSinger).zone).toBe("deck");
//
//       const finalDeckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       expect(finalDeckCards.length).toBe(4);
//     });
//   });
//
//   describe("Edge cases", () => {
//     it("moves card to discard after being played", async () => {
//       const testEngine = new TestEngine({
//         deck: [
//           mickeyBraveLittleTailor,
//           herculesTrueHero,
//           goofyDaredevil,
//           arielSpectacularSinger,
//         ],
//         inkwell: henWensVisions.cost,
//         hand: [henWensVisions],
//       });
//
//       await testEngine.playCard(henWensVisions);
//
//       // Card should be in discard pile after being played
//       expect(testEngine.getCardModel(henWensVisions).zone).toBe("discard");
//
//       // Get the actual cards from the deck after playing
//       const deckCards = testEngine.store.tableStore.getPlayerZoneCards(
//         "player_one",
//         "deck",
//       );
//       const cardsToScry = deckCards.slice(0, 4);
//
//       // Resolve the scry effect
//       await testEngine.resolveTopOfStack({
//         scry: {
//           top: [cardsToScry[0]!],
//           bottom: [cardsToScry[1]!, cardsToScry[2]!, cardsToScry[3]!],
//         },
//       });
//     });
//
//     it("can be played with correct ink cost", async () => {
//       const testEngine = new TestEngine({
//         deck: [
//           mickeyBraveLittleTailor,
//           herculesTrueHero,
//           goofyDaredevil,
//           arielSpectacularSinger,
//         ],
//         inkwell: henWensVisions.cost, // Exactly enough ink
//         hand: [henWensVisions],
//       });
//
//       await testEngine.playCard(henWensVisions);
//       // If we get here without throwing, the card can be played
//
//       // Card should be in discard pile after being played
//       expect(testEngine.getCardModel(henWensVisions).zone).toBe("discard");
//     });
//   });
//
//   describe("Card properties", () => {
//     it("has correct card properties", () => {
//       expect(henWensVisions.name).toBe("Hen Wen's Visions");
//       expect(henWensVisions.type).toBe("action");
//       expect(henWensVisions.colors).toEqual(["sapphire"]);
//       expect(henWensVisions.cost).toBe(1);
//       expect(henWensVisions.inkwell).toBe(true);
//       expect(henWensVisions.set).toBe("010");
//       expect(henWensVisions.number).toBe(161);
//       expect(henWensVisions.rarity).toBe("common");
//       expect(henWensVisions.characteristics).toEqual(["action"]);
//     });
//
//     it("has correct ability structure", () => {
//       expect(henWensVisions.abilities).toHaveLength(1);
//       expect(henWensVisions.abilities![0]!.type).toBe("resolution");
//
//       const effects = henWensVisions.abilities![0]!.effects!;
//       expect(effects).toHaveLength(1);
//       expect((effects[0]! as any).type).toBe("scry");
//       expect((effects[0]! as any).amount).toBe(4);
//       expect((effects[0]! as any).mode).toBe("both");
//
//       const limits = (effects[0]! as any).limits;
//       expect(limits.top).toBe(1);
//       expect(limits.bottom).toBe(3);
//       expect(limits.inkwell).toBe(0);
//       expect(limits.hand).toBe(0);
//
//       expect((effects[0]! as any).target.type).toBe("player");
//       expect((effects[0]! as any).target.value).toBe("self");
//     });
//
//     it("has correct card text", () => {
//       expect(henWensVisions.text).toBe(
//         "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.",
//       );
//
//       expect(henWensVisions.abilities![0]!.text).toBe(
//         "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.",
//       );
//     });
//   });
// });
//
