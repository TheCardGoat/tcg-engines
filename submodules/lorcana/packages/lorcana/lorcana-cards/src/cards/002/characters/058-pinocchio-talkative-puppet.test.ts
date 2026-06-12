import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pinocchioTalkativePuppet } from "./058-pinocchio-talkative-puppet";

const opponentCharA = createMockCharacter({
  id: "pin-tp-opponent-a",
  name: "Opponent Char A",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const opponentCharB = createMockCharacter({
  id: "pin-tp-opponent-b",
  name: "Opponent Char B",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Pinocchio - Talkative Puppet", () => {
  describe("TELLING LIES - When you play this character, you may exert chosen opposing character.", () => {
    it("exerts chosen opposing character when played and trigger is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pinocchioTalkativePuppet],
          inkwell: pinocchioTalkativePuppet.cost,
          deck: 5,
        },
        {
          play: [opponentCharA, opponentCharB],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(pinocchioTalkativePuppet)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pinocchioTalkativePuppet, {
          resolveOptional: true,
          targets: [opponentCharA],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharA)).toBe(true);
      expect(testEngine.isExerted(opponentCharB)).toBe(false);
    });

    it("is optional - declining the trigger leaves opposing characters ready", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pinocchioTalkativePuppet],
          inkwell: pinocchioTalkativePuppet.cost,
          deck: 5,
        },
        {
          play: [opponentCharA],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(pinocchioTalkativePuppet)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pinocchioTalkativePuppet, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharA)).toBe(false);
    });

    it("when played by player two, exerts a chosen player one character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [opponentCharA],
          deck: 5,
        },
        {
          hand: [pinocchioTalkativePuppet],
          inkwell: pinocchioTalkativePuppet.cost,
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(pinocchioTalkativePuppet)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(pinocchioTalkativePuppet, {
          resolveOptional: true,
          targets: [opponentCharA],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharA)).toBe(true);
    });
  });
});
