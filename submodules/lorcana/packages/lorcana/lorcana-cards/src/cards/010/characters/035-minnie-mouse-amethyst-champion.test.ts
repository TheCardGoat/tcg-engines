import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseAmethystChampion } from "./035-minnie-mouse-amethyst-champion";

// Amethyst character to be banished in a challenge
const amethystAlly = createMockCharacter({
  id: "minnie-amethyst-ally",
  name: "Amethyst Ally",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkType: ["amethyst"],
});

// Non-Amethyst character
const nonAmethystAlly = createMockCharacter({
  id: "minnie-non-amethyst-ally",
  name: "Non-Amethyst Ally",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkType: ["amber"],
});

// Strong opponent that can banish allies
const strongAttacker = createMockCharacter({
  id: "minnie-strong-attacker",
  name: "Strong Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
});

describe("Minnie Mouse - Amethyst Champion", () => {
  describe("MYSTICAL BALANCE - Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.", () => {
    it("should trigger when another Amethyst character is banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseAmethystChampion, { card: amethystAlly, exerted: true }],
          deck: 3,
        },
        {
          play: [strongAttacker],
        },
      );

      // Pass turn so opponent can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges our Amethyst ally
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, amethystAlly),
      ).toBeSuccessfulCommand();

      // Verify the Amethyst character was banished
      expect(testEngine.asPlayerOne().getCardZone(amethystAlly)).toBe("discard");

      // The trigger should be in the bag for player one
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("should draw a card when the optional trigger is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseAmethystChampion, { card: amethystAlly, exerted: true }],
          deck: 3,
        },
        {
          play: [strongAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, amethystAlly),
      ).toBeSuccessfulCommand();

      // Accept the optional draw trigger
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseAmethystChampion, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Verify we drew a card
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 2 });
    });

    it("should NOT draw a card when the optional trigger is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseAmethystChampion, { card: amethystAlly, exerted: true }],
          deck: 3,
        },
        {
          play: [strongAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, amethystAlly),
      ).toBeSuccessfulCommand();

      // Decline the optional draw trigger
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseAmethystChampion, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // No card drawn
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 3 });
    });

    it("should NOT trigger when Minnie Mouse herself is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMouseAmethystChampion, exerted: true }],
          deck: 3,
        },
        {
          play: [strongAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges Minnie Mouse herself
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, minnieMouseAmethystChampion),
      ).toBeSuccessfulCommand();

      // Verify Minnie was banished
      expect(testEngine.asPlayerOne().getCardZone(minnieMouseAmethystChampion)).toBe("discard");

      // No trigger should fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("should NOT trigger when a non-Amethyst character is banished in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseAmethystChampion, { card: nonAmethystAlly, exerted: true }],
          deck: 3,
        },
        {
          play: [strongAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges our non-Amethyst character
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, nonAmethystAlly),
      ).toBeSuccessfulCommand();

      // Verify the non-Amethyst character was banished
      expect(testEngine.asPlayerOne().getCardZone(nonAmethystAlly)).toBe("discard");

      // No trigger should fire (Minnie only cares about Amethyst characters)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("should NOT trigger when an Amethyst character is banished outside of a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseAmethystChampion, amethystAlly],
          deck: 3,
        },
        {},
      );

      // Banish the Amethyst character directly (not in a challenge)
      expect(testEngine.asServer().manualSetDamage(amethystAlly, 10)).toBeSuccessfulCommand();

      // Verify the Amethyst character was banished
      expect(testEngine.asPlayerOne().getCardZone(amethystAlly)).toBe("discard");

      // No trigger should fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
