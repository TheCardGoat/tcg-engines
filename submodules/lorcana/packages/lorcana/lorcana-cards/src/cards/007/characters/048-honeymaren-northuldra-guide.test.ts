import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { honeymarenNorthuldraGuide } from "./048-honeymaren-northuldra-guide";

const opponentCharacter = createMockCharacter({
  id: "honeymaren-test-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Honeymaren - Northuldra Guide", () => {
  describe("TALE OF THE FIFTH SPIRIT - When you play this character, if an opponent has an exerted character in play, gain 1 lore.", () => {
    it("gains 1 lore when an opponent has an exerted character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [honeymarenNorthuldraGuide],
          inkwell: honeymarenNorthuldraGuide.cost,
          lore: 0,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().playCard(honeymarenNorthuldraGuide)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });

    it("does NOT gain lore when the opponent has no exerted character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [honeymarenNorthuldraGuide],
          inkwell: honeymarenNorthuldraGuide.cost,
          lore: 0,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().playCard(honeymarenNorthuldraGuide)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("does NOT gain lore when the opponent has no characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [honeymarenNorthuldraGuide],
          inkwell: honeymarenNorthuldraGuide.cost,
          lore: 0,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().playCard(honeymarenNorthuldraGuide)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("does NOT gain lore when only the player's own character is exerted", () => {
      const ownCharacter = createMockCharacter({
        id: "honeymaren-test-own",
        name: "Own Character",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [honeymarenNorthuldraGuide],
          inkwell: honeymarenNorthuldraGuide.cost,
          play: [{ card: ownCharacter, exerted: true, isDrying: false }],
          lore: 0,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().playCard(honeymarenNorthuldraGuide)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
