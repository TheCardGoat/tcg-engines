// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { oswaldTheLuckyRabbit } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Oswald - The Lucky Rabbit", () => {
//   It("FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it's an item card, you may play that item for free and they enter play exerted. Otherwise put it on the bottom of your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [oswaldTheLuckyRabbit],
//       Hand: [tipoGrowingSon],
//       Deck: [pawpsicle, hiramFlavershamToymaker],
//     });
//
//     Await testEngine.putIntoInkwell(tipoGrowingSon);
//     Expect(testEngine.getAvailableInkwellCardCount()).toBe(1);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       {
//         Scry: {
//           Play: [pawpsicle],
//         },
//       },
//       True,
//     );
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 1,
//         Discard: 0,
//         Hand: 0,
//         Play: 2,
//         Inkwell: 1,
//       }),
//     );
//   });
//
//   It("Draw item but choose not to play", async () => {
//     Const testEngine = new TestEngine({
//       Play: [oswaldTheLuckyRabbit],
//       Hand: [tipoGrowingSon],
//       Deck: [pawpsicle, hiramFlavershamToymaker],
//     });
//
//     Const hiram = testEngine.getCardModel(hiramFlavershamToymaker);
//     Const pawp = testEngine.getCardModel(pawpsicle);
//
//     Await testEngine.putIntoInkwell(tipoGrowingSon);
//     Expect(testEngine.getAvailableInkwellCardCount()).toBe(1);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       {
//         Scry: {
//           Bottom: [pawpsicle],
//         },
//       },
//       True,
//     );
//     Await testEngine.drawCard();
//
//     Expect(testEngine.getCardZone(hiram)).toBe("hand");
//     Expect(testEngine.getCardZone(pawp)).toBe("deck");
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 1,
//         Discard: 0,
//         Hand: 1,
//         Play: 1,
//         Inkwell: 1,
//       }),
//     );
//   });
//
//   It("if NOT an item card then put onto bottom of deck", async () => {
//     Const testEngine = new TestEngine({
//       Play: [oswaldTheLuckyRabbit],
//       Hand: [pawpsicle],
//       Deck: [tipoGrowingSon, hiramFlavershamToymaker],
//     });
//
//     Const hiram = testEngine.getCardModel(hiramFlavershamToymaker);
//     Const tipo = testEngine.getCardModel(tipoGrowingSon);
//
//     Await testEngine.putIntoInkwell(pawpsicle);
//     Expect(testEngine.getAvailableInkwellCardCount()).toBe(1);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       {
//         Scry: {
//           Bottom: [tipoGrowingSon],
//         },
//       },
//       True,
//     );
//
//     Await testEngine.drawCard();
//
//     Expect(testEngine.getCardZone(hiram)).toBe("hand");
//     Expect(testEngine.getCardZone(tipo)).toBe("deck");
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 1,
//         Discard: 0,
//         Hand: 1,
//         Play: 1,
//         Inkwell: 1,
//       }),
//     );
//   });
// });
//
// // describe("Regression", () => {
// //   it("Multiple Oswalds do not let players move cards to the bottom", async () => {
// //     const testEngine = new TestEngine({
// //       play: [oswaldTheLuckyRabbit, oswaldTheLuckyRabbit],
// //       hand: [pawpsicle],
// //       deck: [tipoGrowingSon, fortisphere, hiramFlavershamToymaker],
// //     });
// //
// //     throw new Error("Not implemented");
// //     const hiram = testEngine.getCardModel(hiramFlavershamToymaker);
// //     const tipo = testEngine.getCardModel(tipoGrowingSon);
// //
// //     await testEngine.putIntoInkwell(pawpsicle);
// //     expect(testEngine.getAvailableInkwellCardCount()).toBe(1);
// //
// //     await testEngine.resolveOptionalAbility();
// //     await testEngine.resolveTopOfStack(
// //       {
// //         scry: {
// //           bottom: [tipoGrowingSon],
// //         },
// //       },
// //       true,
// //     );
// //
// //     await testEngine.drawCard();
// //
// //     expect(testEngine.getCardZone(hiram)).toBe("hand");
// //     expect(testEngine.getCardZone(tipo)).toBe("deck");
// //     expect(testEngine.getZonesCardCount()).toEqual(
// //       expect.objectContaining({
// //         deck: 1,
// //         discard: 0,
// //         hand: 1,
// //         play: 1,
// //         inkwell: 1,
// //       }),
// //     );
// //   });
// // });
//
