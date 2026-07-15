import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { nathanielFlintNotoriousPirate } from "./196-nathaniel-flint-notorious-pirate";
import { fireTheCannons } from "../../001/actions/197-fire-the-cannons";

const opponentCharacter = createMockCharacter({
  id: "opponent-char-1",
  name: "Opponent Character",
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 1,
});

const ownCharacter = createMockCharacter({
  id: "own-char-1",
  name: "Own Character",
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 1,
});

const weakOpponentCharacter = createMockCharacter({
  id: "weak-opponent-char",
  name: "Weak Opponent",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Nathaniel Flint - Notorious Pirate", () => {
  describe("PREDATORY INSTINCT - You can't play this character unless an opposing character was damaged this turn.", () => {
    it("cannot be played when no opposing character was damaged this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nathanielFlintNotoriousPirate],
        inkwell: nathanielFlintNotoriousPirate.cost,
        play: [],
      });

      const result = testEngine.asPlayerOne().playCard(nathanielFlintNotoriousPirate);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(nathanielFlintNotoriousPirate)).toBe("hand");
    });

    it("can be played after dealing damage to an opposing character this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nathanielFlintNotoriousPirate, fireTheCannons],
          inkwell: nathanielFlintNotoriousPirate.cost + fireTheCannons.cost,
          play: [],
        },
        {
          play: [opponentCharacter],
        },
      );

      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [opponentCharacter],
      });
      const result = testEngine.asPlayerOne().playCard(nathanielFlintNotoriousPirate);

      expect(result.success).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(nathanielFlintNotoriousPirate)).toBe("play");
    });

    it("cannot be played when only own character was damaged this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nathanielFlintNotoriousPirate, fireTheCannons],
        inkwell: nathanielFlintNotoriousPirate.cost + fireTheCannons.cost,
        play: [ownCharacter],
      });

      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [ownCharacter],
      });
      const result = testEngine.asPlayerOne().playCard(nathanielFlintNotoriousPirate);

      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(nathanielFlintNotoriousPirate)).toBe("hand");
    });

    it("can be played when opposing character was banished by damage this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nathanielFlintNotoriousPirate, fireTheCannons],
          inkwell: nathanielFlintNotoriousPirate.cost + fireTheCannons.cost,
          play: [],
        },
        {
          play: [weakOpponentCharacter],
        },
      );

      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [weakOpponentCharacter],
      });
      const result = testEngine.asPlayerOne().playCard(nathanielFlintNotoriousPirate);

      expect(result.success).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(nathanielFlintNotoriousPirate)).toBe("play");
    });
  });
});
