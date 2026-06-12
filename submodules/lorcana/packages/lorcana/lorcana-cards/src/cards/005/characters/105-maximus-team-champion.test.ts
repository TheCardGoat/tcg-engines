import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { maximusTeamChampion } from "./105-maximus-team-champion";

const strongCharacter = createMockCharacter({
  id: "mock-strong-5",
  name: "Strong Character",
  cost: 5,
  strength: 5,
  willpower: 3,
  lore: 1,
});

const veryStrongCharacter = createMockCharacter({
  id: "mock-strong-10",
  name: "Very Strong Character",
  cost: 8,
  strength: 10,
  willpower: 5,
  lore: 2,
});

describe("Maximus - Team Champion", () => {
  describe("ROYALLY BIG REWARDS - At the end of your turn, if you have any characters in play with 5 {S} or more, gain 2 lore. If you have any in play with 10 {S} or more, gain 5 lore instead.", () => {
    it("does not gain lore when you do not control a character with 5 or more strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [maximusTeamChampion],
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });

    it("gains 2 lore when a character has 5 or more strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [maximusTeamChampion, strongCharacter],
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
    });

    it("gains 5 lore instead when you control a character with 10 or more strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [maximusTeamChampion, strongCharacter, veryStrongCharacter],
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(5);
    });
  });

  it("regression: end-of-turn ability does not freeze the game (turn passes normally)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [maximusTeamChampion, strongCharacter],
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    // Pass turn - end of turn trigger should fire and resolve without freezing
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);

    // Game should continue normally - player two can take their turn
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Player one's turn again - should work normally
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(4);
  });
});
