import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { eeyoreInTheWay } from "./045-eeyore-in-the-way";

const opponentCharacter = createMockCharacter({
  id: "eeyore-test-opp",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Eeyore - In the Way", () => {
  describe("Card properties", () => {
    it("should have correct stats", () => {
      expect(eeyoreInTheWay.cost).toBe(9);
      expect(eeyoreInTheWay.strength).toBe(5);
      expect(eeyoreInTheWay.willpower).toBe(5);
      expect(eeyoreInTheWay.lore).toBe(2);
    });

    it("should be an inkable amethyst card", () => {
      expect(eeyoreInTheWay.inkable).toBe(true);
      expect(eeyoreInTheWay.inkType).toEqual(["amethyst"]);
    });

    it("should have Storyborn Ally classifications", () => {
      expect(eeyoreInTheWay.classifications).toEqual(["Storyborn", "Ally"]);
    });
  });

  describe("THANKS FOR NOTICIN' ME - For each exerted character in play, you pay 1 less to play this character", () => {
    it("should be playable at full cost when no exerted characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [eeyoreInTheWay],
        inkwell: eeyoreInTheWay.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWay)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(eeyoreInTheWay)).toBe("play");
    });

    it.todo("should reduce cost by 1 for each exerted character in play — requires engine support for 'action' type cost reduction", () => {});
  });

  describe("SORRY ABOUT THAT - When you play this character, you may choose an opposing character that can't ready", () => {
    it("should trigger an optional bag effect when played with opposing characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWay],
          inkwell: eeyoreInTheWay.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWay)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("should apply cant-ready restriction to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWay],
          inkwell: eeyoreInTheWay.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWay)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(eeyoreInTheWay, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(true);

      // Pass player one's turn — at start of player two's turn, the character should NOT ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("should be optional — can decline to choose a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWay],
          inkwell: eeyoreInTheWay.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWay)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(eeyoreInTheWay, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Opponent's character should not have the restriction
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(false);
    });

    it("should not trigger when there are no opposing characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWay],
          inkwell: eeyoreInTheWay.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWay)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(eeyoreInTheWay)).toBe("play");
    });
  });
});
