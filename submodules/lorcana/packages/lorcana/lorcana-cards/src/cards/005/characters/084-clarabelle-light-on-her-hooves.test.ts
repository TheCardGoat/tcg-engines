import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { clarabelleLightOnHerHooves } from "./084-clarabelle-light-on-her-hooves";

const drawnCards = Array.from({ length: 6 }, (_, index) =>
  createMockCharacter({
    id: `clarabelle-drawn-${index + 1}`,
    name: `Drawn ${index + 1}`,
    cost: 1,
  }),
);

describe("Clarabelle - Light on Her Hooves", () => {
  describe("KEEP IN STEP - At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.", () => {
    it("draws until the controller has the same number of cards in hand as the opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleLightOnHerHooves],
          inkwell: clarabelleLightOnHerHooves.cost,
          deck: drawnCards,
        },
        {
          hand: 6,
        },
      );

      expect(testEngine.asPlayerOne().playCard(clarabelleLightOnHerHooves)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(clarabelleLightOnHerHooves, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 6 });
      for (const card of drawnCards) {
        expect(testEngine.asPlayerOne().getCardZone(card)).toBe("hand");
      }
    });

    it("can decline the optional draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleLightOnHerHooves],
          inkwell: clarabelleLightOnHerHooves.cost,
          deck: drawnCards,
        },
        {
          hand: 6,
        },
      );

      expect(testEngine.asPlayerOne().playCard(clarabelleLightOnHerHooves)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(clarabelleLightOnHerHooves, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 6 });
      for (const card of drawnCards) {
        expect(testEngine.asPlayerOne().getCardZone(card)).toBe("deck");
      }
    });

    it("regression: actually draws the correct number of cards to match opponent's hand size", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleLightOnHerHooves],
          inkwell: clarabelleLightOnHerHooves.cost,
          deck: drawnCards,
        },
        {
          hand: 3,
        },
      );

      // Play Clarabelle, hand becomes 0
      expect(testEngine.asPlayerOne().playCard(clarabelleLightOnHerHooves)).toBeSuccessfulCommand();

      // Pass turn to trigger KEEP IN STEP (opponent has 3 cards, player has 0)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(clarabelleLightOnHerHooves, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Should have drawn 3 cards to match opponent's 3
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 3 });
    });

    it("regression: resolves cleanly when deck has fewer cards than the draw target (no softlock)", () => {
      // Reports #22/#23/#27/#28/#35 — KEEP IN STEP softlocks turn end. Most plausible
      // root cause is an iterative draw that hangs when the deck runs out before the
      // hand sizes match. Opponent has 5 cards, controller has 0, but only 2 in deck.
      const shortDeck = drawnCards.slice(0, 2);
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleLightOnHerHooves],
          inkwell: clarabelleLightOnHerHooves.cost,
          deck: shortDeck,
        },
        {
          hand: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(clarabelleLightOnHerHooves)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(clarabelleLightOnHerHooves, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Should have drawn the available 2 cards and resolved without leaving a pending bag.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 0 });
    });

    it("does not trigger if the opponent does not have more cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [clarabelleLightOnHerHooves],
          inkwell: clarabelleLightOnHerHooves.cost,
          deck: drawnCards,
        },
        {
          hand: [],
          deck: 0,
        },
      );

      expect(testEngine.asPlayerOne().playCard(clarabelleLightOnHerHooves)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 6 });
    });
  });
});
