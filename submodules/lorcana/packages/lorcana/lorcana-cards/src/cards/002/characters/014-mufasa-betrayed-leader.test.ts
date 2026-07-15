import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mufasaBetrayedLeader } from "./014-mufasa-betrayed-leader";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";
import { bibbidiBobbidiBoo } from "../../002/actions/096-bibbidi-bobbidi-boo";

describe("Mufasa - Betrayed Leader", () => {
  describe("THE SUN WILL SET - When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.", () => {
    it("triggers when banished, reveals character, and plays it for free exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mufasaBetrayedLeader }],
        deck: [{ card: gastonBaritoneBully }],
      });

      // Banish Mufasa with enough damage
      expect(
        testEngine.asServer().manualSetDamage(mufasaBetrayedLeader, 10),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mufasaBetrayedLeader)).toBe("discard");

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mufasaBetrayedLeader, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Resolve the scry — choose to play Gaston for free
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [{ zone: "play", cards: [gastonBaritoneBully] }],
        }),
      ).toBeSuccessfulCommand();

      // Gaston should be in play and exerted
      expect(testEngine.asPlayerOne().getCardZone(gastonBaritoneBully)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(gastonBaritoneBully)).toBe(true);
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        deck: 0,
        play: 1,
        discard: 1,
      });
    });

    it("triggers when banished, reveals non-character, and puts it on top of deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mufasaBetrayedLeader }],
        deck: [{ card: bibbidiBobbidiBoo }],
      });

      // Banish Mufasa with enough damage
      expect(
        testEngine.asServer().manualSetDamage(mufasaBetrayedLeader, 10),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(mufasaBetrayedLeader)).toBe("discard");

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mufasaBetrayedLeader, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Non-character doesn't match the play filter — resolve scry with no hand selection
      expect(
        testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
      ).toBeSuccessfulCommand();

      // Action card should remain on top of deck
      expect(testEngine.asPlayerOne().getCardZone(bibbidiBobbidiBoo)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        deck: 1,
        play: 0,
        discard: 1,
      });
    });

    it("player may decline the optional play when the top card is a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mufasaBetrayedLeader }],
        deck: [{ card: gastonBaritoneBully }],
      });

      // Banish Mufasa with enough damage
      expect(
        testEngine.asServer().manualSetDamage(mufasaBetrayedLeader, 10),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mufasaBetrayedLeader, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Decline playing — resolve scry with empty destinations, Gaston goes to deck-top (remainder)
      expect(
        testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
      ).toBeSuccessfulCommand();

      // Gaston should remain in deck (not played)
      expect(testEngine.asPlayerOne().getCardZone(gastonBaritoneBully)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        deck: 1,
        play: 0,
        discard: 1,
      });
    });

    it("player may decline revealing the top card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mufasaBetrayedLeader }],
        deck: [{ card: gastonBaritoneBully }],
      });

      expect(
        testEngine.asServer().manualSetDamage(mufasaBetrayedLeader, 10),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mufasaBetrayedLeader, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(gastonBaritoneBully)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({
        deck: 1,
        play: 0,
        discard: 1,
      });
    });
  });

  describe("Regression: Removed on opponent's turn", () => {
    it("triggers correctly when banished during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
        },
        {
          play: [{ card: mufasaBetrayedLeader }],
          // bibbidiBobbidiBoo is on top (last entry = top), drawn at turn start, leaving Gaston in deck
          deck: [{ card: gastonBaritoneBully }, { card: bibbidiBobbidiBoo }],
        },
      );

      // Pass turn to player two (player two will draw a placeholder card, not Gaston)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Banish Mufasa during player two's turn
      expect(
        testEngine.asServer().manualSetDamage(mufasaBetrayedLeader, 10),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(mufasaBetrayedLeader)).toBe("discard");

      // Triggered ability should be in the bag for player two (the controller)
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(mufasaBetrayedLeader, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Resolve the scry — choose to play Gaston for free
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          destinations: [{ zone: "play", cards: [gastonBaritoneBully] }],
        }),
      ).toBeSuccessfulCommand();

      // Gaston should be in play for player two and exerted
      expect(testEngine.asPlayerTwo().getCardZone(gastonBaritoneBully)).toBe("play");
      expect(testEngine.asPlayerTwo().isExerted(gastonBaritoneBully)).toBe(true);
    });
  });
});
