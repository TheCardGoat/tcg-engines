// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/157-tipo-growing-son";
// import { heiheiProtectiveRooster } from "@lorcanito/lorcana-engine/cards/005/characters/179-heihei-protective-rooster";
// import {
//   nalaUndauntedLioness,
//   scarFinallyKing,
// } from "@lorcanito/lorcana-engine/cards/009";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Scar - Finally King", () => {
//   it("BE GRATEFUL Your Ally characters get +1 {S}.", async () => {
//     const testEngine = new TestEngine({
//       play: [scarFinallyKing, nalaUndauntedLioness],
//     });
//
//     expect(testEngine.getCardModel(nalaUndauntedLioness).strength).toEqual(
//       nalaUndauntedLioness.strength + 1,
//     );
//   });
//
//   it("STICK WITH ME At the end of your turn, if this character is exerted, you may draw cards equal to the {S} of a chosen Ally character of yours. If you do, choose and discard 2 cards and banish that character.", async () => {
//     const testEngine = new TestEngine({
//       play: [scarFinallyKing, heiheiProtectiveRooster],
//       deck: 15,
//     });
//
//     // Scars gives +1 strength to all Ally characters
//     const target = testEngine.getCardModel(heiheiProtectiveRooster);
//     // So the amount of cards to draw is equal to the strength of Heihei + 1
//     const cardsToDraw = target.strength;
//     expect(cardsToDraw).toEqual(5);
//
//     await testEngine.tapCard(scarFinallyKing);
//     await testEngine.passTurn();
//
//     testEngine.changeActivePlayer("player_one");
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [target] }, true);
//
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         deck: 15 - cardsToDraw,
//         hand: cardsToDraw,
//         discard: 1, // Hei Hei is banished
//       }),
//     );
//
//     const twoCardsFromHand = testEngine
//       .getCardsByZone("hand", "player_one")
//       .slice(0, 2);
//     await testEngine.resolveTopOfStack({ targets: twoCardsFromHand });
//
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         deck: 15 - cardsToDraw,
//         hand: cardsToDraw - 2,
//         discard: 2 + 1, // 1 for the banished character
//       }),
//     );
//
//     expect(target.zone).toEqual("discard");
//   });
//
//   describe("Regression", () => {
//     it("Draw 2 Discard 2", async () => {
//       const testEngine = new TestEngine({
//         play: [scarFinallyKing, tipoGrowingSon],
//         deck: 15,
//       });
//
//       // Scars gives +1 strength to all Ally characters
//       const target = testEngine.getCardModel(tipoGrowingSon);
//       // So the amount of cards to draw is equal to the strength of Heihei + 1
//       const cardsToDraw = target.strength;
//       expect(cardsToDraw).toEqual(2);
//
//       await testEngine.tapCard(scarFinallyKing);
//       await testEngine.passTurn();
//
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({ targets: [target] }, true);
//
//       expect(testEngine.getZonesCardCount()).toEqual(
//         expect.objectContaining({
//           deck: 13,
//           hand: 2,
//           discard: 1,
//         }),
//       );
//
//       const twoCardsFromHand = testEngine
//         .getCardsByZone("hand", "player_one")
//         .slice(0, 2);
//       await testEngine.resolveTopOfStack({ targets: twoCardsFromHand });
//
//       expect(testEngine.getZonesCardCount()).toEqual(
//         expect.objectContaining({
//           hand: 0,
//           discard: 3, // 1 for the banished character
//         }),
//       );
//
//       expect(target.zone).toEqual("discard");
//     });
//   });
// });
//
