import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lyleTiberiusRourkeCrystallizedMercenary } from "./140-lyle-tiberius-rourke-crystallized-mercenary";

const inkableCard = createMockCharacter({
  id: "lyle-ink-fodder",
  name: "Ink Fodder",
  cost: 1,
  inkable: true,
});

const opponentCharacter = createMockCharacter({
  id: "lyle-opponent-char",
  name: "Opponent Character",
  cost: 2,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const playerOneCharacter = createMockCharacter({
  id: "lyle-p1-char",
  name: "Player One Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Lyle Tiberius Rourke - Crystallized Mercenary", () => {
  describe("EXPLOSIVE - Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.", () => {
    it("triggers when a card is put into inkwell and deals 2 damage to all characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lyleTiberiusRourkeCrystallizedMercenary, playerOneCharacter],
          hand: [inkableCard],
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(opponentCharacter)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(playerOneCharacter)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(lyleTiberiusRourkeCrystallizedMercenary)).toBe(2);
    });

    it("does not trigger on opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lyleTiberiusRourkeCrystallizedMercenary],
          deck: 5,
        },
        {
          hand: [inkableCard],
          play: [opponentCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().ink(inkableCard)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(opponentCharacter)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(lyleTiberiusRourkeCrystallizedMercenary)).toBe(0);
    });
  });
});
