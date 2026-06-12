import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { andThenAlongCameZeus } from "../actions";
import { ursulaDeceiver } from "./090-ursula-deceiver";

describe("Ursula - Deceiver", () => {
  describe("YOU'LL NEVER EVEN MISS IT - When you play this character, chosen opponent reveals their hand and discards a song card of your choice.", () => {
    it("reveals the opponent's hand and discards a song card chosen by the controller", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaDeceiver],
          inkwell: ursulaDeceiver.cost,
        },
        {
          hand: [andThenAlongCameZeus, mickeyMouseTrueFriend],
        },
      );

      const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);
      const songCardId = testEngine.findCardInstanceId(andThenAlongCameZeus, "hand", "p2");

      // Play Ursula — triggers the ability which reveals hand and suspends on discard choice
      expect(testEngine.asPlayerOne().playCard(ursulaDeceiver)).toBeSuccessfulCommand();

      // Controller chooses the song card to discard
      expect(testEngine.asPlayerOne().respondWith(songCardId)).toBeSuccessfulCommand();

      // Opponent's hand cards should have been revealed
      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBe(true);
      }

      // Song card should be discarded
      expect(testEngine.asPlayerTwo().getCardZone(andThenAlongCameZeus)).toBe("discard");

      // Non-song card remains in hand
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
    });

    it("does not discard non-song cards when filtering", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ursulaDeceiver],
          inkwell: ursulaDeceiver.cost,
        },
        {
          hand: [mickeyMouseTrueFriend],
        },
      );

      const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(ursulaDeceiver)).toBeSuccessfulCommand();

      // Opponent's hand should have been revealed even when there are no songs
      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBe(true);
      }

      // Non-song cards stay in hand (no valid targets for discard, effect auto-resolves)
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
    });
  });
});
