// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import {
//   deweyLovableShowoff,
//   gastonArrogantShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gaston - Arrogant Showoff", () => {
//   it("BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gastonArrogantShowoff.cost,
//       hand: [gastonArrogantShowoff],
//       play: [deweyLovableShowoff, luckyDime],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(gastonArrogantShowoff);
//
//     await testEngine.playCard(cardUnderTest);
//     await testEngine.acceptOptionalLayer();
//
//     await testEngine.resolveTopOfStack({ targets: [luckyDime] }, true);
//     expect(testEngine.getCardModel(luckyDime).zone).toEqual("discard");
//
//     await testEngine.resolveTopOfStack({ targets: [deweyLovableShowoff] });
//     expect(testEngine.getCardModel(deweyLovableShowoff).strength).toEqual(
//       deweyLovableShowoff.strength + 2,
//     );
//   });
// });
//
