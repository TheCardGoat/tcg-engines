// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { describe, expect, it } from "@jest/globals";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { kingCandySovereignOfSugar } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { kingsSensorCore } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("King's Sensor Core - Item", () => {
//   Describe("**SYMBOL OF NOBILITY** At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.", () => {
//     It("Should give resist to your Prince and King characters in play", () => {
//       Const testEngine = new TestEngine({
//         Play: [kingCandySovereignOfSugar, goonsMaleficent, kingsSensorCore],
//       });
//       Const cardThatShouldHaveResist = testEngine.getCardModel(
//         KingCandySovereignOfSugar,
//       );
//       Const cardThatShouldNotHaveResist =
//         TestEngine.getCardModel(goonsMaleficent);
//
//       Expect(cardThatShouldHaveResist.hasResist).toEqual(true);
//       Expect(cardThatShouldNotHaveResist.hasResist).toEqual(false);
//     });
//   });
//   It("**ROYAL SEARCH** {E}, 2 {I} – Reveal the top card of your deck. If it’s a Prince or King character card, you may put it into your hand. Otherwise, put it on the top of your deck.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 2,
//       Play: [kingsSensorCore],
//       Deck: [kingCandySovereignOfSugar],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(kingsSensorCore);
//     Const topCard = testEngine.getCardModel(kingCandySovereignOfSugar);
//
//     CardUnderTest.activate();
//     TestEngine.resolveTopOfStack({ scry: { hand: [topCard] } });
//
//     Expect(cardUnderTest.meta.exerted).toBe(true);
//     Expect(topCard.zone).toBe("hand");
//   });
// });
//
