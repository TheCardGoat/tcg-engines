import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lumiereFieryFriend } from "./113-lumiere-fiery-friend";

const allyCharacter = createMockCharacter({
  id: "lumiere-fiery-friend-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const wardCharacter = createMockCharacter({
  id: "lumiere-fiery-friend-ward-ally",
  name: "Ward Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  abilities: [
    {
      id: "ward-keyword",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
  ],
});

describe("Lumiere - Fiery Friend", () => {
  describe("FERVENT ADDRESS - Your other characters get +1 {S}.", () => {
    it("gives +1 strength to other characters when Lumiere is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereFieryFriend, allyCharacter],
      });

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(
        allyCharacter.strength + 1,
      );
    });

    it("does not give +1 strength to Lumiere himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereFieryFriend],
      });

      expect(testEngine.asPlayerOne().getCardStrength(lumiereFieryFriend)).toBe(
        lumiereFieryFriend.strength,
      );
    });

    it("gives strength to characters with Ward", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereFieryFriend, wardCharacter],
      });

      expect(testEngine.asPlayerOne().getCardStrength(wardCharacter)).toBe(
        wardCharacter.strength + 1,
      );
    });

    it("persists across turns", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lumiereFieryFriend, allyCharacter],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(
        allyCharacter.strength + 1,
      );

      testEngine.asPlayerOne().passTurn();

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(
        allyCharacter.strength + 1,
      );
    });

    it("does not give bonus to opponent's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lumiereFieryFriend],
          deck: 1,
        },
        {
          play: [allyCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerTwo().getCardStrength(allyCharacter)).toBe(allyCharacter.strength);
    });

    it("two Lumieres give +2 strength to other characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereFieryFriend, lumiereFieryFriend, allyCharacter],
      });

      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(
        allyCharacter.strength + 2,
      );
    });

    it("two Lumieres give +1 strength to each other", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereFieryFriend, lumiereFieryFriend],
      });

      expect(testEngine.asPlayerOne().getCardStrength(lumiereFieryFriend)).toBe(
        lumiereFieryFriend.strength + 1,
      );
    });
  });
});
