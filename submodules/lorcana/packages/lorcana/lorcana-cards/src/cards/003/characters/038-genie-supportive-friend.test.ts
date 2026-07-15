import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { genieSupportiveFriend } from "./038-genie-supportive-friend";

describe("Genie - Supportive Friend", () => {
  describe("THREE WISHES - Whenever this character quests, you may shuffle this card into your deck to draw 3 cards", () => {
    it("accepting the optional shuffles Genie into deck and draws 3 cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: genieSupportiveFriend, isDrying: false }],
        deck: 30,
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;
      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(genieSupportiveFriend)).toBeSuccessfulCommand();

      // Resolve the triggered ability bag, accepting the optional
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(genieSupportiveFriend, { resolveOptional: true });

      // Genie should no longer be in play (shuffled into deck)
      expect(testEngine.asPlayerOne().getCardZone(genieSupportiveFriend)).not.toBe("play");

      // Should have drawn 3 cards
      const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
      expect(handAfter).toBe(handBefore + 3);

      // Deck should have lost 2 net cards (Genie added 1, drew 3: net -2)
      const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
      expect(deckAfter).toBe(deckBefore + 1 - 3);

      // Should have gained lore from questing
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
        loreBefore + genieSupportiveFriend.lore,
      );
    });

    it("declining the optional keeps Genie in play and does not draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: genieSupportiveFriend, isDrying: false }],
        deck: 10,
      });

      const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;

      expect(testEngine.asPlayerOne().quest(genieSupportiveFriend)).toBeSuccessfulCommand();

      // Resolve the triggered ability bag and decline the optional
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(genieSupportiveFriend, { resolveOptional: false });

      // Genie should remain in play
      expect(testEngine.asPlayerOne().getCardZone(genieSupportiveFriend)).toBe("play");

      // Should not have drawn any cards
      const handAfter = testEngine.asPlayerOne().getZonesCardCount().hand;
      expect(handAfter).toBe(handBefore);
    });
  });
});
