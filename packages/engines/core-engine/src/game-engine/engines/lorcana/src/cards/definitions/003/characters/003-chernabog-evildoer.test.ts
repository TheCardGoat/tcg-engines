/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { chernabogEvildoer } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  arthurNoviceSparrow,
  chacaImpressiveDaughter,
  ludwigVonDrakeSelfproclaimedGenius,
  petePastryChomper,
  theQueenCruelestOfAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Chernabog - Evildoer", () => {
  describe("**THE POWER OF EVIL** When you play this character, pay 1 {I} less for every character card in your discard.", () => {
    it("Playing full cost", () => {
      const testStore = new TestStore({
        inkwell: chernabogEvildoer.cost,
        hand: [chernabogEvildoer],
      });

      const cardUnderTest = testStore.getCard(chernabogEvildoer);

      cardUnderTest.playFromHand();

      expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
      expect(cardUnderTest.zone).toBe("play");
    });

    it("One damaged Character", () => {
      const testStore = new TestStore({
        inkwell: chernabogEvildoer.cost - 1,
        discard: [petePastryChomper],
        hand: [chernabogEvildoer],
      });

      const cardUnderTest = testStore.getCard(chernabogEvildoer);

      cardUnderTest.playFromHand();

      expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
      expect(cardUnderTest.zone).toBe("play");
    });

    it("Five damaged Character", () => {
      const testStore = new TestStore({
        inkwell: 5,
        discard: [
          petePastryChomper,
          arthurNoviceSparrow,
          chacaImpressiveDaughter,
          theQueenCruelestOfAll,
          ludwigVonDrakeSelfproclaimedGenius,
        ],
        hand: [chernabogEvildoer],
      });

      const cardUnderTest = testStore.getCard(chernabogEvildoer);

      cardUnderTest.playFromHand();

      expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
      expect(cardUnderTest.zone).toBe("play");
    });
  });

  it("**SUMMON THE SPIRITS** When you play this character, shuffle all character cards from your discard into your deck.", () => {
    const discard = [
      petePastryChomper,
      arthurNoviceSparrow,
      chacaImpressiveDaughter,
      theQueenCruelestOfAll,
      ludwigVonDrakeSelfproclaimedGenius,
    ];
    const testStore = new TestStore({
      inkwell: chernabogEvildoer.cost,
      discard: discard,
      hand: [chernabogEvildoer],
    });

    const cardUnderTest = testStore.getCard(chernabogEvildoer);

    cardUnderTest.playFromHand();

    expect(cardUnderTest.zone).toBe("play");
    discard.forEach((card) => {
      expect(testStore.getCard(card).zone).toBe("deck");
    });
  });
});
