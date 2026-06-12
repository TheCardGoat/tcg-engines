import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kashekimWiseKing } from "./158-kashekim-wise-king";

const discardFodder = createMockCharacter({
  id: "kashekim-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const discardFodder2 = createMockCharacter({
  id: "kashekim-discard-fodder-2",
  name: "Discard Fodder 2",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const topOfDeck = createMockCharacter({
  id: "kashekim-top-of-deck",
  name: "Top Of Deck",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Kashekim - Wise King", () => {
  describe("STRENGTH IN MEMORY - At the end of your turn, if 2 or more cards were put into your discard this turn, you may put the top card of your deck into your inkwell facedown.", () => {
    it("puts the top card of your deck into your inkwell when 2+ cards entered your discard this turn and you accept the optional", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kashekimWiseKing],
        hand: [discardFodder, discardFodder2],
        deck: [topOfDeck],
      });

      // Put two cards into our discard this turn so the end-turn condition is met.
      const fodder1Id = testEngine.findCardInstanceId(discardFodder, "hand", PLAYER_ONE);
      const fodder2Id = testEngine.findCardInstanceId(discardFodder2, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodder1Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualMoveCard(fodder2Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Resolve the end-of-turn trigger, accepting the optional.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kashekimWiseKing, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(topOfDeck)).toBe("inkwell");
    });

    it("does not put a card into the inkwell when fewer than 2 cards entered your discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kashekimWiseKing],
        hand: [discardFodder],
        deck: [topOfDeck],
      });

      // Only 1 card put into discard — condition (2+) should fail.
      const fodder1Id = testEngine.findCardInstanceId(discardFodder, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodder1Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Top card should remain in the deck, untouched.
      expect(testEngine.asPlayerOne().getCardZone(topOfDeck)).toBe("deck");
    });

    it("can decline the optional put-into-inkwell even when the condition is met", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kashekimWiseKing],
        hand: [discardFodder, discardFodder2],
        deck: [topOfDeck],
      });

      const fodder1Id = testEngine.findCardInstanceId(discardFodder, "hand", PLAYER_ONE);
      const fodder2Id = testEngine.findCardInstanceId(discardFodder2, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodder1Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualMoveCard(fodder2Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Decline the optional — top card should stay in the deck.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kashekimWiseKing, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(topOfDeck)).toBe("deck");
    });
  });
});
