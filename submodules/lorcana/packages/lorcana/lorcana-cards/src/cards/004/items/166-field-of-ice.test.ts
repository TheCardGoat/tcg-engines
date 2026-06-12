import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fieldOfIce } from "./166-field-of-ice";

const playedCharacter = createMockCharacter({
  id: "field-of-ice-played",
  name: "Played Character",
  cost: 2,
  strength: 3,
  willpower: 5,
});

const attacker = createMockCharacter({
  id: "field-of-ice-attacker",
  name: "Attacker",
  cost: 2,
  strength: 4,
  willpower: 2,
});

describe("Field of Ice", () => {
  describe("ICY DEFENSE — Whenever you play a character, they gain Resist +1 until the start of your next turn.", () => {
    it("grants Resist +1 to the played character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [playedCharacter],
        inkwell: playedCharacter.cost,
        play: [fieldOfIce],
      });

      expect(testEngine.asPlayerOne().hasKeyword(playedCharacter, "Resist")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(playedCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getKeywordValue(playedCharacter, "Resist")).toBe(1);
    });

    it("Resist +1 expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [playedCharacter],
          inkwell: playedCharacter.cost,
          play: [fieldOfIce],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(playedCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getKeywordValue(playedCharacter, "Resist")).toBe(1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getKeywordValue(playedCharacter, "Resist")).toBe(1);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getKeywordValue(playedCharacter, "Resist")).toBeNull();
    });

    it("does not grant Resist to characters the opponent plays", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fieldOfIce],
          deck: 2,
        },
        {
          hand: [playedCharacter],
          inkwell: playedCharacter.cost,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(playedCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().hasKeyword(playedCharacter, "Resist")).toBe(false);
    });
  });
});
