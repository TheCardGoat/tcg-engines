import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { nalaRompingInTheSnow } from "./035-nala-romping-in-the-snow";

const targetCharacter = createMockCharacter({
  id: "nala-test-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "nala-test-opponent",
  name: "Opponent Challenger",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Nala - Romping in the Snow", () => {
  describe("PLAYFUL SLIDE - When you play this character, chosen character of yours gains Evasive until the start of your next turn", () => {
    it("should trigger when Nala is played and give chosen character Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nalaRompingInTheSnow],
        play: [targetCharacter],
        inkwell: nalaRompingInTheSnow.cost,
        deck: 3,
      });

      expect(testEngine.hasKeyword(targetCharacter, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(nalaRompingInTheSnow)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(targetCharacter, "Evasive")).toBe(true);
    });

    it("should keep Evasive during opponent's turn (until start of your next turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nalaRompingInTheSnow],
          play: [targetCharacter],
          inkwell: nalaRompingInTheSnow.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nalaRompingInTheSnow)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(targetCharacter, "Evasive")).toBe(true);

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Evasive should still be active during opponent's turn
      expect(testEngine.hasKeyword(targetCharacter, "Evasive")).toBe(true);
    });

    it("should lose Evasive at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nalaRompingInTheSnow],
          play: [targetCharacter],
          inkwell: nalaRompingInTheSnow.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nalaRompingInTheSnow)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(targetCharacter, "Evasive")).toBe(true);

      // Pass both turns (P1 -> P2 -> P1)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // At start of next turn: Evasive should be gone
      expect(testEngine.hasKeyword(targetCharacter, "Evasive")).toBe(false);
    });

    it("should be able to target Nala herself with Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nalaRompingInTheSnow],
        inkwell: nalaRompingInTheSnow.cost,
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(nalaRompingInTheSnow)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [nalaRompingInTheSnow] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(nalaRompingInTheSnow, "Evasive")).toBe(true);
    });

    it("should prevent non-Evasive opponent characters from challenging the Evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nalaRompingInTheSnow],
          play: [{ card: targetCharacter, exerted: true }],
          inkwell: nalaRompingInTheSnow.cost,
          deck: 5,
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nalaRompingInTheSnow)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(targetCharacter, "Evasive")).toBe(true);

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Non-Evasive character should not be able to challenge the Evasive character
      expect(testEngine.asPlayerTwo().canChallenge(opponentCharacter, targetCharacter)).toBe(false);
    });
  });
});
