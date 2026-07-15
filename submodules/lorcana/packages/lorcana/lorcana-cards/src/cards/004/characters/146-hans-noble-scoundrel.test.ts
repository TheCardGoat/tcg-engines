import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { hansNobleScoundrel } from "./146-hans-noble-scoundrel";

const princessCharacter = createMockCharacter({
  id: "hans-noble-scoundrel-princess-character",
  name: "Princess Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const queenCharacter = createMockCharacter({
  id: "hans-noble-scoundrel-queen-character",
  name: "Queen Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Queen"],
});

const nonRoyalCharacter = createMockCharacter({
  id: "hans-noble-scoundrel-non-royal-character",
  name: "Non-Royal Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Hans - Noble Scoundrel", () => {
  describe("ROYAL SCHEMES - When you play this character, if a Princess or Queen character is in play, gain 1 lore.", () => {
    it("gains 1 lore when played if a Princess character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hansNobleScoundrel],
        inkwell: hansNobleScoundrel.cost,
        play: [princessCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().playCard(hansNobleScoundrel)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("gains 1 lore when played if a Queen character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hansNobleScoundrel],
        inkwell: hansNobleScoundrel.cost,
        play: [queenCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().playCard(hansNobleScoundrel)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("does not gain lore when played if no Princess or Queen is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hansNobleScoundrel],
        inkwell: hansNobleScoundrel.cost,
        play: [nonRoyalCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().playCard(hansNobleScoundrel)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });

    it("does not gain lore when played with no characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hansNobleScoundrel],
        inkwell: hansNobleScoundrel.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().playCard(hansNobleScoundrel)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });

    it("counts opponent's Princess or Queen character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [hansNobleScoundrel],
          inkwell: hansNobleScoundrel.cost,
          deck: 1,
        },
        {
          play: [princessCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().playCard(hansNobleScoundrel)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });
  });
});
