// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/157-tipo-growing-son";
// Import { heiheiProtectiveRooster } from "@lorcanito/lorcana-engine/cards/005/characters/179-heihei-protective-rooster";
// Import {
//   NalaUndauntedLioness,
//   ScarFinallyKing,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scar - Finally King", () => {
//   It("BE GRATEFUL Your Ally characters get +1 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [scarFinallyKing, nalaUndauntedLioness],
//     });
//
//     Expect(testEngine.getCardModel(nalaUndauntedLioness).strength).toEqual(
//       NalaUndauntedLioness.strength + 1,
//     );
//   });
//
//   It("STICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of a chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [scarFinallyKing, heiheiProtectiveRooster],
//       Deck: 15,
//     });
//
//     // Scars gives +1 strength to all Ally characters
//     Const target = testEngine.getCardModel(heiheiProtectiveRooster);
//     // So the amount of cards to draw is equal to the strength of Heihei + 1
//     Const cardsToDraw = target.strength;
//     Expect(cardsToDraw).toEqual(5);
//
//     Await testEngine.tapCard(scarFinallyKing);
//     Await testEngine.passTurn();
//
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [target] }, true);
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 15 - cardsToDraw,
//         Hand: cardsToDraw,
//         Discard: 1, // Hei Hei is banished
//       }),
//     );
//
//     Const twoCardsFromHand = testEngine
//       .getCardsByZone("hand", "player_one")
//       .slice(0, 2);
//     Await testEngine.resolveTopOfStack({ targets: twoCardsFromHand });
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 15 - cardsToDraw,
//         Hand: cardsToDraw - 2,
//         Discard: 2 + 1, // 1 for the banished character
//       }),
//     );
//
//     Expect(target.zone).toEqual("discard");
//   });
//
//   Describe("Regression", () => {
//     It("Draw 2 Discard 2", async () => {
//       Const testEngine = new TestEngine({
//         Play: [scarFinallyKing, tipoGrowingSon],
//         Deck: 15,
//       });
//
//       // Scars gives +1 strength to all Ally characters
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//       // So the amount of cards to draw is equal to the strength of Heihei + 1
//       Const cardsToDraw = target.strength;
//       Expect(cardsToDraw).toEqual(2);
//
//       Await testEngine.tapCard(scarFinallyKing);
//       Await testEngine.passTurn();
//
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({ targets: [target] }, true);
//
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 13,
//           Hand: 2,
//           Discard: 1,
//         }),
//       );
//
//       Const twoCardsFromHand = testEngine
//         .getCardsByZone("hand", "player_one")
//         .slice(0, 2);
//       Await testEngine.resolveTopOfStack({ targets: twoCardsFromHand });
//
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Discard: 3, // 1 for the banished character
//         }),
//       );
//
//       Expect(target.zone).toEqual("discard");
//     });
//   });
// });
//
