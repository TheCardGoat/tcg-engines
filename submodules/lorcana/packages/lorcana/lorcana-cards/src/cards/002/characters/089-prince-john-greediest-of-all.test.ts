import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { princeJohnGreediestOfAll } from "./089-prince-john-greediest-of-all";
import { suddenChill } from "../../001/actions/098-sudden-chill";
import { youHaveForgottenMe } from "../../001/actions/031-you-have-forgotten-me";

const discardFodder1 = createMockCharacter({
  id: "pj-discard-fodder-1",
  name: "Discard Fodder 1",
  cost: 1,
});

const discardFodder2 = createMockCharacter({
  id: "pj-discard-fodder-2",
  name: "Discard Fodder 2",
  cost: 1,
});

const ownDiscardFodder = createMockCharacter({
  id: "pj-own-discard-fodder",
  name: "Own Discard Fodder",
  cost: 1,
});

describe("Prince John - Greediest of All", () => {
  it("has Ward", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princeJohnGreediestOfAll],
    });
    expect(testEngine.getCardModel(princeJohnGreediestOfAll).hasWard()).toBe(true);
  });

  describe("I SENTENCE YOU - Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.", () => {
    it("triggers when opponent discards 1 card and player may draw 1 card", () => {
      // Player one has Prince John in play plus suddenChill to make player_two discard.
      // Player two has 1 card in hand to discard.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnGreediestOfAll],
          hand: [suddenChill],
          inkwell: suddenChill.cost,
          deck: 3,
        },
        {
          hand: [discardFodder1],
        },
      );

      // Player one plays Sudden Chill — makes each opponent (player_two) choose and discard 1 card
      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      // Player two must choose a card to discard
      const discardFodder1Id = testEngine.findCardInstanceId(discardFodder1, "hand", "player_two");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [discardFodder1Id] }),
      ).toBeSuccessfulCommand();

      // Discard completed — Prince John's trigger should have fired
      expect(testEngine.asPlayerTwo().getCardZone(discardFodder1)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const deckCountBefore = testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck;

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(princeJohnGreediestOfAll, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Should draw exactly 1 card (1 card was discarded)
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck).toBe(deckCountBefore - 1);
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(1);
    });

    it("does not trigger when the Prince John controller (player_one) discards a card", () => {
      // Prince John is on player_one's side. Sudden Chill played by player_two makes player_one discard.
      // Prince John watches for the OPPONENT (player_two) to discard, not the controller.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnGreediestOfAll],
          hand: [ownDiscardFodder],
          deck: 3,
        },
        {
          hand: [suddenChill],
          inkwell: suddenChill.cost,
        },
      );

      // Pass turn so player_two can play
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two plays Sudden Chill — makes player_one (who has Prince John) discard a card
      expect(testEngine.asPlayerTwo().playCard(suddenChill)).toBeSuccessfulCommand();

      // Player one (Prince John's controller) must discard
      const ownDiscardFodderId = testEngine.findCardInstanceId(
        ownDiscardFodder,
        "hand",
        PLAYER_ONE,
      );
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [ownDiscardFodderId] }),
      ).toBeSuccessfulCommand();

      // Prince John's trigger should NOT fire because the controller (player_one) discarded,
      // not the opponent (player_two)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("triggers once when opponent discards 2 cards at once and draws 2 cards total", () => {
      // Player one has Prince John + youHaveForgottenMe to make player_two discard 2
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnGreediestOfAll],
          hand: [youHaveForgottenMe],
          inkwell: youHaveForgottenMe.cost,
          deck: 5,
        },
        {
          hand: [discardFodder1, discardFodder2],
        },
      );

      // Player one plays You Have Forgotten Me — makes each opponent (player_two) choose and discard 2 cards
      expect(testEngine.asPlayerOne().playCard(youHaveForgottenMe)).toBeSuccessfulCommand();

      // Player two must discard 2 cards
      const discardFodder1Id = testEngine.findCardInstanceId(discardFodder1, "hand", "player_two");
      const discardFodder2Id = testEngine.findCardInstanceId(discardFodder2, "hand", "player_two");
      expect(
        testEngine
          .asPlayerTwo()
          .resolveNextPending({ targets: [discardFodder1Id, discardFodder2Id] }),
      ).toBeSuccessfulCommand();

      // Both discarded
      expect(testEngine.asPlayerTwo().getCardZone(discardFodder1)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(discardFodder2)).toBe("discard");

      // Prince John's ability triggers ONCE (batched), with triggerAmount=2
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const deckCountBefore = testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck;

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(princeJohnGreediestOfAll, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Should draw 2 cards (one for each card discarded)
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck).toBe(deckCountBefore - 2);
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(2);
    });

    it("regression: does NOT show a false when-played trigger (only triggers on opponent discard, not on play)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [princeJohnGreediestOfAll],
        inkwell: princeJohnGreediestOfAll.cost,
        deck: 3,
      });

      // Play Prince John
      expect(testEngine.asPlayerOne().playCard(princeJohnGreediestOfAll)).toBeSuccessfulCommand();

      // Prince John has no when-played trigger - bag should be empty
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("can decline the optional draw when opponent discards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [princeJohnGreediestOfAll],
          hand: [suddenChill],
          inkwell: suddenChill.cost,
          deck: 3,
        },
        {
          hand: [discardFodder1],
        },
      );

      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      const discardFodder1Id = testEngine.findCardInstanceId(discardFodder1, "hand", "player_two");
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [discardFodder1Id] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(princeJohnGreediestOfAll, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // No cards drawn — declined the optional
      expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).hand).toBe(0);
    });
  });
});
