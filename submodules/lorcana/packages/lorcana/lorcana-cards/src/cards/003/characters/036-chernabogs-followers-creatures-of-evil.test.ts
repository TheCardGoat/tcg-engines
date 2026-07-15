import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { chernabogsFollowersCreaturesOfEvil } from "./036-chernabogs-followers-creatures-of-evil";

describe("Chernabog's Followers - Creatures of Evil", () => {
  describe("RESTLESS SOULS - Whenever this character quests, you may banish them to draw a card.", () => {
    it("should banish this character and draw a card when accepting the optional", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: chernabogsFollowersCreaturesOfEvil, isDrying: false }],
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().quest(chernabogsFollowersCreaturesOfEvil),
      ).toBeSuccessfulCommand();

      // Accept the optional ability
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(chernabogsFollowersCreaturesOfEvil),
      ).toBeSuccessfulCommand();

      // Character should be banished (moved to discard)
      expect(testEngine.asPlayerOne().getCardZone(chernabogsFollowersCreaturesOfEvil)).toBe(
        "discard",
      );

      // Should have drawn a card
      expect(testEngine.asServer().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);

      // Should have gained lore from questing
      expect(testEngine.getLore(PLAYER_ONE)).toBe(chernabogsFollowersCreaturesOfEvil.lore);
    });

    it("should not banish this character and not draw when declining the optional", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: chernabogsFollowersCreaturesOfEvil, isDrying: false }],
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().quest(chernabogsFollowersCreaturesOfEvil),
      ).toBeSuccessfulCommand();

      // Decline the optional ability
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(chernabogsFollowersCreaturesOfEvil, { resolveOptional: false });

      // Character should still be in play
      expect(testEngine.asPlayerOne().getCardZone(chernabogsFollowersCreaturesOfEvil)).toBe("play");

      // Should not have drawn a card
      expect(testEngine.asServer().getCardsInZone("hand", PLAYER_ONE).count).toBe(0);

      // Should still have gained lore from questing
      expect(testEngine.getLore(PLAYER_ONE)).toBe(chernabogsFollowersCreaturesOfEvil.lore);
    });
  });
});
