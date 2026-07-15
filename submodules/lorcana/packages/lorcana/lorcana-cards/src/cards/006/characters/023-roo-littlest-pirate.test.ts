import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { rooLittlestPirate } from "./023-roo-littlest-pirate";

const opponentCharacter = createMockCharacter({
  id: "roo-test-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const ownCharacter = createMockCharacter({
  id: "roo-test-own-char",
  name: "Own Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Roo - Littlest Pirate", () => {
  describe("Card properties", () => {
    it("should have correct stats", () => {
      expect(rooLittlestPirate.cost).toBe(2);
      expect(rooLittlestPirate.strength).toBe(1);
      expect(rooLittlestPirate.willpower).toBe(2);
      expect(rooLittlestPirate.lore).toBe(1);
    });

    it("should be an inkable amber card", () => {
      expect(rooLittlestPirate.inkable).toBe(true);
      expect(rooLittlestPirate.inkType).toEqual(["amber"]);
    });

    it("should have correct classifications", () => {
      expect(rooLittlestPirate.classifications).toEqual(["Dreamborn", "Ally", "Pirate"]);
    });
  });

  describe("I'M A PIRATE TOO! - When you play this character, you may give chosen character -2 {S} until the start of your next turn", () => {
    it("should trigger an optional bag effect when played with characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rooLittlestPirate],
          inkwell: rooLittlestPirate.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rooLittlestPirate)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(rooLittlestPirate)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("should apply -2 strength to chosen character when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rooLittlestPirate],
          inkwell: rooLittlestPirate.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      const targetId = testEngine.findCardInstanceId(opponentCharacter, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(rooLittlestPirate)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [targetId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(1);
    });

    it("should be optional — can decline the effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rooLittlestPirate],
          inkwell: rooLittlestPirate.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rooLittlestPirate)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(3);
    });

    it("should be able to target own characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rooLittlestPirate],
          play: [ownCharacter],
          inkwell: rooLittlestPirate.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const targetId = testEngine.findCardInstanceId(ownCharacter, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(rooLittlestPirate)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [targetId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ownCharacter)).toBe(0);
    });

    it("should persist through opponent's turn and expire at start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rooLittlestPirate],
          inkwell: rooLittlestPirate.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      const targetId = testEngine.findCardInstanceId(opponentCharacter, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().playCard(rooLittlestPirate)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [targetId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(1);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(3);
    });

    it("should still create a bag effect when Roo is the only character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rooLittlestPirate],
          inkwell: rooLittlestPirate.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(rooLittlestPirate)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });
  });
});
