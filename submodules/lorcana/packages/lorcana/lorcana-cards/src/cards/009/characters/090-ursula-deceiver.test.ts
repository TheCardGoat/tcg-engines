import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { andThenAlongCameZeus } from "../../003/actions";
import { ursulaDeceiver } from "./090-ursula-deceiver";
import { daisyDuckDonaldsDate } from "../../005";

describe("Ursula - Deceiver (set 009)", () => {
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

      // Song card should be discarded
      expect(testEngine.asPlayerTwo().getCardZone(andThenAlongCameZeus)).toBe("discard");

      // Non-song card remains in hand
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");

      // All opponent hand cards should have been revealed
      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBe(true);
      }
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

      expect(testEngine.asPlayerOne().playCard(ursulaDeceiver)).toBeSuccessfulCommand();

      // Non-song cards stay in hand (no valid targets for discard, effect auto-resolves)
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
    });
  });

  it("regression: controller (not opponent) chooses which song to discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ursulaDeceiver],
        inkwell: ursulaDeceiver.cost,
      },
      {
        hand: [andThenAlongCameZeus, mickeyMouseTrueFriend],
      },
    );

    const songCardId = testEngine.findCardInstanceId(andThenAlongCameZeus, "hand", "p2");

    expect(testEngine.asPlayerOne().playCard(ursulaDeceiver)).toBeSuccessfulCommand();

    // The CONTROLLER (player one) should choose which card to discard, not the opponent
    expect(testEngine.asPlayerOne().respondWith(songCardId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(andThenAlongCameZeus)).toBe("discard");
  });

  it("regression: opponent doesn't have valid discard targets. The game must continue.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ursulaDeceiver],
        inkwell: ursulaDeceiver.cost,
        play: [daisyDuckDonaldsDate],
      },
      {
        hand: [mickeyMouseTrueFriend],
      },
    );

    // The command should successfully resolve, given the opponent doesn't have a valid target. Trigger resolution will be canceled with no-valid-targets
    expect(testEngine.asPlayerOne().playCard(ursulaDeceiver)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(daisyDuckDonaldsDate)).toBeSuccessfulCommand();
  });
});
