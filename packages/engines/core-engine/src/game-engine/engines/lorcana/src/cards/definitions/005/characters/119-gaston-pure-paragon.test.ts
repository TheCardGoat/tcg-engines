/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  arthurNoviceSparrow,
  chacaImpressiveDaughter,
  gastonPureParagon,
  ludwigVonDrakeSelfproclaimedGenius,
  petePastryChomper,
  theQueenCruelestOfAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Gaston - Pure Paragon", () => {
  describe("**A MAN AMONG MEN!** For each damaged character you have in play, you pay 2 {I} less to play this character.<br/>**Rush** _(This character can challenge the turn they're played.)_", () => {
    it("Playing full cost", () => {
      const testStore = new TestStore({
        inkwell: gastonPureParagon.cost,
        hand: [gastonPureParagon],
      });

      const cardUnderTest = testStore.getCard(gastonPureParagon);

      cardUnderTest.playFromHand();

      expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
      expect(cardUnderTest.zone).toBe("play");
    });

    it("One damaged Character", () => {
      const testStore = new TestStore({
        inkwell: gastonPureParagon.cost - 2,
        play: [petePastryChomper],
        hand: [gastonPureParagon],
      });

      const cardUnderTest = testStore.getCard(gastonPureParagon);

      const pete = testStore.getCard(petePastryChomper);
      pete.updateCardDamage(1, "add");

      cardUnderTest.playFromHand();

      expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
      expect(cardUnderTest.zone).toBe("play");
    });

    it("Five damaged Character", () => {
      const cardsInPlay = [
        petePastryChomper,
        arthurNoviceSparrow,
        chacaImpressiveDaughter,
        theQueenCruelestOfAll,
        ludwigVonDrakeSelfproclaimedGenius,
      ];
      const testStore = new TestStore({
        inkwell: 0,
        play: cardsInPlay,
        hand: [gastonPureParagon],
      });

      const cardUnderTest = testStore.getCard(gastonPureParagon);

      const pete = testStore.getCard(petePastryChomper);

      cardsInPlay.forEach((card) => {
        testStore.getCard(card).updateCardDamage(1, "add");
      });

      cardUnderTest.playFromHand();

      expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
      expect(cardUnderTest.zone).toBe("play");
    });
  });
});
