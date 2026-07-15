// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import {
//   DeweyLovableShowoff,
//   GastonArrogantShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gaston - Arrogant Showoff", () => {
//   It("BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gastonArrogantShowoff.cost,
//       Hand: [gastonArrogantShowoff],
//       Play: [deweyLovableShowoff, luckyDime],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(gastonArrogantShowoff);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.acceptOptionalLayer();
//
//     Await testEngine.resolveTopOfStack({ targets: [luckyDime] }, true);
//     Expect(testEngine.getCardModel(luckyDime).zone).toEqual("discard");
//
//     Await testEngine.resolveTopOfStack({ targets: [deweyLovableShowoff] });
//     Expect(testEngine.getCardModel(deweyLovableShowoff).strength).toEqual(
//       DeweyLovableShowoff.strength + 2,
//     );
//   });
// });
//
