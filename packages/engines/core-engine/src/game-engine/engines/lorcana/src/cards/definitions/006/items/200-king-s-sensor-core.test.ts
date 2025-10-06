import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { goonsMaleficent } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { kingCandySovereignOfSugar } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { kingsSensorCore } from "~/game-engine/engines/lorcana/src/cards/definitions/006";

describe("King's Sensor Core - Item", () => {
  describe("**SYMBOL OF NOBILITY** At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.", () => {
    it("Should give resist to your Prince and King characters in play", () => {
      const testEngine = new TestEngine({
        play: [kingCandySovereignOfSugar, goonsMaleficent, kingsSensorCore],
      });
      const cardThatShouldHaveResist = testEngine.getCardModel(
        kingCandySovereignOfSugar,
      );
      const cardThatShouldNotHaveResist =
        testEngine.getCardModel(goonsMaleficent);

      expect(cardThatShouldHaveResist.hasResist).toEqual(true);
      expect(cardThatShouldNotHaveResist.hasResist).toEqual(false);
    });
  });
  it("**ROYAL SEARCH** {E}, 2 {I} – Reveal the top card of your deck. If it’s a Prince or King character card, you may put it into your hand. Otherwise, put it on the top of your deck.", () => {
    const testEngine = new TestEngine({
      inkwell: 2,
      play: [kingsSensorCore],
      deck: [kingCandySovereignOfSugar],
    });

    const cardUnderTest = testEngine.getCardModel(kingsSensorCore);
    const topCard = testEngine.getCardModel(kingCandySovereignOfSugar);

    cardUnderTest.activate();
    testEngine.resolveTopOfStack({ scry: { hand: [topCard] } });

    expect(cardUnderTest.meta.exerted).toBe(true);
    expect(topCard.zone).toBe("hand");
  });
});
