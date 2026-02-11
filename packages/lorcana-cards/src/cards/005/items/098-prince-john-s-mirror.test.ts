// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyBraveLittleTailor,
//   MickeyMouseDetective,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   MickeyMouseFriendlyFace,
//   PrinceCharmingHeirToTheThrone,
//   PrinceJohnGreediestOfAll,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { princeJohnsMirror } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince John's Mirror", () => {
//   It("**YOU LOOK REGAL** If you have a character named Prince John in play, you pay 1 {I} less to play this item.", () => {
//     Const testStore = new TestStore({
//       Inkwell: princeJohnsMirror.cost - 1,
//       Hand: [princeJohnsMirror],
//       Play: [princeJohnGreediestOfAll],
//     });
//
//     Const cardUnderTest = testStore.getCard(princeJohnsMirror);
//
//     CardUnderTest.playFromHand();
//
//     Expect(cardUnderTest.zone).toEqual("play");
//   });
//
//   Describe("**A FEELING OF POWER** At the end of each opponent’s turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.", () => {
//     It("Opponent owns the mirror", async () => {
//       Const testStore = new TestEngine(
//         {
//           Hand: [
//             MickeyMouseTrueFriend,
//             MickeyBraveLittleTailor,
//             MickeyMouseDetective,
//             MickeyMouseFriendlyFace,
//             PrinceCharmingHeirToTheThrone,
//           ],
//           Deck: 5,
//         },
//         {
//           Play: [princeJohnsMirror],
//           Deck: 5,
//         },
//       );
//
//       Await testStore.passTurn();
//       Expect(testStore.store.turnCount).toBe(0);
//       Expect(testStore.stackLayers).toHaveLength(1);
//
//       Expect(testStore.getZonesCardCount("player_one").hand).toBe(5);
//
//       TestStore.changeActivePlayer("player_one");
//       Await testStore.resolveTopOfStack({
//         Targets: [mickeyMouseFriendlyFace, mickeyMouseDetective],
//       });
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(testStore.store.turnCount).toBe(1);
//
//       Expect(testStore.getCardModel(mickeyMouseFriendlyFace).zone).toEqual(
//         "discard",
//       );
//       Expect(testStore.getCardModel(mickeyMouseDetective).zone).toEqual(
//         "discard",
//       );
//     });
//
//     It("Player owns the mirror", () => {
//       Const testStore = new TestStore(
//         {
//           Hand: [princeJohnGreediestOfAll],
//           Play: [princeJohnsMirror],
//           Deck: 5,
//         },
//         {
//           Hand: [
//             MickeyMouseTrueFriend,
//             MickeyBraveLittleTailor,
//             MickeyMouseDetective,
//             MickeyMouseFriendlyFace,
//           ],
//           Deck: 5,
//         },
//       );
//
//       Const cardToDiscard = testStore.getCard(mickeyMouseFriendlyFace);
//       Const anotherCardToDiscard = testStore.getCard(mickeyMouseDetective);
//
//       TestStore.passTurn();
//       Expect(testStore.store.turnCount).toBe(1);
//       Expect(testStore.stackLayers).toHaveLength(0);
//
//       TestStore.passTurn();
//       Expect(testStore.store.turnCount).toBe(1);
//       Expect(testStore.stackLayers).toHaveLength(1);
//
//       TestStore.changePlayer("player_two");
//       TestStore.resolveTopOfStack({
//         Targets: [cardToDiscard, anotherCardToDiscard],
//       });
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(testStore.store.turnCount).toBe(2);
//
//       Expect(cardToDiscard.zone).toEqual("discard");
//       Expect(anotherCardToDiscard.zone).toEqual("discard");
//     });
//   });
// });
//
