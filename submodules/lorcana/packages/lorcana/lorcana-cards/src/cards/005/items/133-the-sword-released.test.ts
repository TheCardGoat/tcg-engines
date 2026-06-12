import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theSwordReleased } from "./133-the-sword-released";

const strongCharacter = createMockCharacter({
  id: "sword-strong",
  name: "Strong Character",
  cost: 3,
  strength: 5,
  willpower: 5,
});

const weakOpponent = createMockCharacter({
  id: "sword-weak-opponent",
  name: "Weak Opponent",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const strongerOpponent = createMockCharacter({
  id: "sword-stronger-opponent",
  name: "Stronger Opponent",
  cost: 4,
  strength: 6,
  willpower: 4,
});

describe("The Sword Released", () => {
  describe("POWER APPOINTED — At the start of your turn, if you have a character with more {S} than each opposing character, each opponent loses 1 lore and you gain lore equal to the lore lost.", () => {
    it("each opponent loses 1 lore and you gain that lore when your character outstrengths all opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theSwordReleased, strongCharacter],
          deck: 2,
        },
        {
          play: [weakOpponent],
          deck: 2,
        },
      );

      testEngine.asServer().manualSetLore(PLAYER_TWO, 3);

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(3);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Trigger fires at the start of P1's turn — bag queued for P1
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theSwordReleased),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("resolves with no effect when your strongest character does not exceed all opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theSwordReleased, strongCharacter],
          deck: 2,
        },
        {
          play: [strongerOpponent],
          deck: 2,
        },
      );

      testEngine.asServer().manualSetLore(PLAYER_TWO, 3);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Trigger fires unconditionally; condition is checked at resolution time
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theSwordReleased),
      ).toBeSuccessfulCommand();

      // Condition failed (P1 char strength 5 < opponent strength 6) — no lore change
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(3);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });

    it("you gain 0 lore when the opponent already has 0 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theSwordReleased, strongCharacter],
          deck: 2,
        },
        {
          play: [weakOpponent],
          deck: 2,
        },
      );

      // P2 has 0 lore — they can't lose any
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theSwordReleased),
      ).toBeSuccessfulCommand();

      // P2 lost 0 lore (was already at 0), so P1 gains 0
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });

    it("resolves with no effect when you have no characters in play (requireLeftNonEmpty)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theSwordReleased],
          deck: 2,
        },
        {
          play: [weakOpponent],
          deck: 2,
        },
      );

      testEngine.asServer().manualSetLore(PLAYER_TWO, 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Trigger fires; condition checked at resolution — requireLeftNonEmpty: true fails
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theSwordReleased),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });

    it("triggers when you have a character but the opponent has no characters (ifRightEmpty: pass)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theSwordReleased, strongCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      testEngine.asServer().manualSetLore(PLAYER_TWO, 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Right side empty → condition passes per ifRightEmpty: "pass"
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theSwordReleased),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(1);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });
  });
});
