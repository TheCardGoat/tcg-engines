import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { meekoSkittishScrounger } from "./046-meeko-skittish-scrounger";
import { madamMimSnake } from "../../002";
import { heiheiBoatSnack, mickeyMouseTrueFriend } from "../../001";

describe("Meeko - Skittish Scrounger", () => {
  it("does not apply BOTTOMLESS PIT when Meeko is ready at end of turn (intervening if: not exerted)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meekoSkittishScrounger],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().isExerted(meekoSkittishScrounger)).toBe(false);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(meekoSkittishScrounger)).toBe("play");
  });

  it("does not even enter the bag when Meeko is ready at end of turn (phantom-trigger regression)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meekoSkittishScrounger],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().isExerted(meekoSkittishScrounger)).toBe(false);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("applies BOTTOMLESS PIT when Meeko is exerted — empty hand resolves with Meeko banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meekoSkittishScrounger],
      hand: [],
      deck: 2,
    });
    testEngine.asServer().manualExertCard(meekoSkittishScrounger);
    expect(testEngine.asPlayerOne().isExerted(meekoSkittishScrounger)).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    expect(testEngine.asPlayerOne().getCardZone(meekoSkittishScrounger)).toBe("discard");
  });

  describe("Regression", () => {
    it("should not let players skip the banish when there's not cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: meekoSkittishScrounger, exerted: true },
          { card: meekoSkittishScrounger, exerted: true },
        ],
        hand: [madamMimSnake],
        inkwell: 6,
        deck: [heiheiBoatSnack, heiheiBoatSnack, heiheiBoatSnack],
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Both BOTTOMLESS PIT triggers are queued.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

      // Resolve the first Meeko trigger: choose to discard, targeting Madam Mim - Snake.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(meekoSkittishScrounger, {
          choiceIndex: 0,
          targets: [madamMimSnake],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(madamMimSnake)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(0);

      // The second Meeko trigger auto-resolves to the only legal branch.
      // With no cards in hand, "discard a card" cannot be chosen, so Meeko
      // must be banished instead of leaving a stale choice in the bag.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardsInZone("play", "player_one").count).toBe(1);
      expect(testEngine.asPlayerOne().getCardsInZone("discard", "player_one").count).toBe(2);
    });
  });
});
