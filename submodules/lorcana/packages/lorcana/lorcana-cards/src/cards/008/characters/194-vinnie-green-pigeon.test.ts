import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { vinnieGreenPigeon } from "./194-vinnie-green-pigeon";

const allyOne = createMockCharacter({
  id: "vinnie-ally-one",
  name: "Ally One",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const allyTwo = createMockCharacter({
  id: "vinnie-ally-two",
  name: "Ally Two",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Vinnie - Green Pigeon", () => {
  describe("LEARNING EXPERIENCE - During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.", () => {
    it("gains 1 lore when one of your other characters is banished during an opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vinnieGreenPigeon, { card: allyOne, isDrying: false }],
        },
        {},
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asServer().manualSetDamage(allyOne, 10)).toBeSuccessfulCommand();

      const loreAfter = testEngine.getLore(PLAYER_ONE);
      expect(loreAfter).toBe(loreBefore + 1);
    });

    it("gains 1 lore when another ally is banished during an opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            vinnieGreenPigeon,
            { card: allyOne, isDrying: false },
            { card: allyTwo, isDrying: false },
          ],
        },
        {},
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asServer().manualSetDamage(allyTwo, 10)).toBeSuccessfulCommand();

      const loreAfter = testEngine.getLore(PLAYER_ONE);
      expect(loreAfter).toBe(loreBefore + 1);
    });

    it("does not trigger during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vinnieGreenPigeon, { card: allyOne, isDrying: false }],
        },
        {},
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asServer().manualSetDamage(allyOne, 10)).toBeSuccessfulCommand();

      const loreAfter = testEngine.getLore(PLAYER_ONE);
      expect(loreAfter).toBe(loreBefore);
    });

    it("does not trigger when Vinnie itself is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [vinnieGreenPigeon, { card: allyOne, isDrying: false }],
        },
        {},
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asServer().manualSetDamage(vinnieGreenPigeon, 10)).toBeSuccessfulCommand();

      const loreAfter = testEngine.getLore(PLAYER_ONE);
      expect(loreAfter).toBe(loreBefore);
    });
  });
});
