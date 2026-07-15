import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { broadwaySturdyAndStrong } from "./190-broadway-sturdy-and-strong";

const friendlyCharacter = createMockCharacter({
  id: "broadway-friendly",
  name: "Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const attackingOpponent = createMockCharacter({
  id: "broadway-attacker",
  name: "Attacker",
  cost: 4,
  strength: 5,
  willpower: 5,
});

describe("Broadway - Sturdy and Strong", () => {
  describe("Bodyguard", () => {
    it("has the Bodyguard keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [broadwaySturdyAndStrong],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(broadwaySturdyAndStrong, "Bodyguard")).toBe(true);
    });

    it("can enter play exerted when resolveOptional is true", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [broadwaySturdyAndStrong],
          inkwell: broadwaySturdyAndStrong.cost,
          deck: 2,
        },
        { deck: 2 },
      );

      expect(
        testEngine.asPlayerOne().playCard(broadwaySturdyAndStrong, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(broadwaySturdyAndStrong)).toBe(true);
    });

    it("must be challenged before friendly characters when exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: broadwaySturdyAndStrong, exerted: true },
            { card: friendlyCharacter, exerted: true },
          ],
          deck: 2,
        },
        {
          play: [attackingOpponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent must challenge Broadway (Bodyguard), not the friendly character
      expect(
        testEngine.asPlayerTwo().challenge(attackingOpponent, friendlyCharacter),
      ).not.toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(attackingOpponent, broadwaySturdyAndStrong),
      ).toBeSuccessfulCommand();
    });
  });
});
