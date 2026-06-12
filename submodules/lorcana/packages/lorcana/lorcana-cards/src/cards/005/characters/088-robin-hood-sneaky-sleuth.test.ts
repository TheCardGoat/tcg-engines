import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { robinHoodSneakySleuth } from "./088-robin-hood-sneaky-sleuth";

const mockOpponentChar1 = createMockCharacter({
  id: "opponent-char-1",
  name: "Opponent Character 1",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const mockOpponentChar2 = createMockCharacter({
  id: "opponent-char-2",
  name: "Opponent Character 2",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const mockOpponentChar3 = createMockCharacter({
  id: "opponent-char-3",
  name: "Opponent Character 3",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const mockOwnChar = createMockCharacter({
  id: "own-char",
  name: "Own Character",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Robin Hood - Sneaky Sleuth", () => {
  describe("Shift 3", () => {
    it("has Shift 3 keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [robinHoodSneakySleuth],
      });

      expect(testEngine.asPlayerOne().hasKeyword(robinHoodSneakySleuth, "Shift")).toBe(true);
    });
  });

  describe("CLEVER PLAN: This character gets +1 {L} for each opposing damaged character in play.", () => {
    it("has base lore when no opposing damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodSneakySleuth],
        },
        {
          play: [mockOpponentChar1, mockOpponentChar2],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(robinHoodSneakySleuth)).toBe(1);
    });

    it("gets +1 lore for each opposing damaged character (1 damaged = 2 lore)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodSneakySleuth],
        },
        {
          play: [{ card: mockOpponentChar1, damage: 1 }, mockOpponentChar2],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(robinHoodSneakySleuth)).toBe(2);
    });

    it("gets +1 lore for each opposing damaged character (2 damaged = 3 lore)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodSneakySleuth],
        },
        {
          play: [
            { card: mockOpponentChar1, damage: 1 },
            { card: mockOpponentChar2, damage: 1 },
            mockOpponentChar3,
          ],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(robinHoodSneakySleuth)).toBe(3);
    });

    it("gets +1 lore for each opposing damaged character (3 damaged = 4 lore)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodSneakySleuth],
        },
        {
          play: [
            { card: mockOpponentChar1, damage: 1 },
            { card: mockOpponentChar2, damage: 1 },
            { card: mockOpponentChar3, damage: 1 },
          ],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(robinHoodSneakySleuth)).toBe(4);
    });

    it("does NOT count own damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodSneakySleuth, { card: mockOwnChar, damage: 1 }],
        },
        {
          play: [mockOpponentChar1],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(robinHoodSneakySleuth)).toBe(1);
    });

    it("does NOT count undamaged opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodSneakySleuth],
        },
        {
          play: [mockOpponentChar1, mockOpponentChar2, mockOpponentChar3],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(robinHoodSneakySleuth)).toBe(1);
    });

    it("counts only damaged opposing characters (mixed state)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [robinHoodSneakySleuth],
        },
        {
          play: [
            { card: mockOpponentChar1, damage: 1 },
            mockOpponentChar2,
            { card: mockOpponentChar3, damage: 2 },
          ],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(robinHoodSneakySleuth)).toBe(3);
    });
  });
});
