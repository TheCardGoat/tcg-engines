import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { vanellopeVonSchweetzGutsyGogetter } from "./110-vanellope-von-schweetz-gutsy-go-getter";

const testLocation = createMockLocation({
  id: "vanellope-gutsy-test-location",
  name: "Test Location",
  cost: 2,
  moveCost: 1,
  willpower: 5,
  lore: 0,
});

describe("Vanellope Von Schweetz - Gutsy Go-Getter", () => {
  describe("Card properties", () => {
    it("should have card number 110", () => {
      expect(vanellopeVonSchweetzGutsyGogetter.cardNumber).toBe(110);
    });

    it("should have correct stats", () => {
      expect(vanellopeVonSchweetzGutsyGogetter.cost).toBe(3);
      expect(vanellopeVonSchweetzGutsyGogetter.strength).toBe(2);
      expect(vanellopeVonSchweetzGutsyGogetter.willpower).toBe(3);
      expect(vanellopeVonSchweetzGutsyGogetter.lore).toBe(1);
    });

    it("should be an inkable ruby card", () => {
      expect(vanellopeVonSchweetzGutsyGogetter.inkable).toBe(true);
      expect(vanellopeVonSchweetzGutsyGogetter.inkType).toEqual(["ruby"]);
    });
  });

  describe("AS READY AS I'LL EVER BE - At the start of your turn, if this character is at a location, draw a card and gain 1 lore.", () => {
    it("draws a card and gains 1 lore at start of turn when at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            testLocation,
            {
              card: vanellopeVonSchweetzGutsyGogetter,
              atLocation: testLocation,
            },
          ],
          deck: 3,
        },
        {
          deck: 2,
        },
        {
          startingLore: { [PLAYER_ONE]: 0 },
        },
      );

      // Pass turn to get back to P1's start of turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // The trigger should fire and auto-resolve (draw + lore gain)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(vanellopeVonSchweetzGutsyGogetter),
        ).toBeSuccessfulCommand();
      }

      // Should have gained 1 lore
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
      // Should have drawn 2 cards total: 1 from the standard beginning-of-turn draw step
      // and 1 from the ability trigger (deck goes from 3 to 1)
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 2,
        deck: 1,
      });
    });

    it("does not draw or gain lore at start of turn when NOT at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vanellopeVonSchweetzGutsyGogetter],
          deck: 3,
        },
        {
          deck: 2,
        },
        {
          startingLore: { [PLAYER_ONE]: 0 },
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Lore should be unchanged (no lore gain from ability - condition not met)
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      // Only the standard beginning-of-turn draw should have happened (deck goes from 3 to 2)
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        hand: 1,
        deck: 2,
      });
    });
  });
});
