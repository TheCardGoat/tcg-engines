import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { robinHoodArcheryContestant } from "./077-robin-hood-archery-contestant";

const damagedOpponentCharacter = createMockCharacter({
  id: "robin-hood-damaged-opponent",
  name: "Damaged Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const undamagedOpponentCharacter = createMockCharacter({
  id: "robin-hood-undamaged-opponent",
  name: "Undamaged Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const ownDamagedCharacter = createMockCharacter({
  id: "robin-hood-own-damaged",
  name: "Own Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Robin Hood - Archery Contestant", () => {
  describe("TRICK SHOT - When you play this character, if an opponent has a damaged character in play, gain 1 lore.", () => {
    it("gains 1 lore when opponent has a damaged character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodArcheryContestant],
          inkwell: robinHoodArcheryContestant.cost,
          deck: 5,
        },
        {
          play: [{ card: damagedOpponentCharacter, damage: 1 }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodArcheryContestant)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
    });

    it("does not gain lore when opponent has no damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodArcheryContestant],
          inkwell: robinHoodArcheryContestant.cost,
          deck: 5,
        },
        {
          play: [undamagedOpponentCharacter],
        },
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodArcheryContestant)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
    });

    it("does not gain lore when opponent has no characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodArcheryContestant],
          inkwell: robinHoodArcheryContestant.cost,
          deck: 5,
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodArcheryContestant)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
    });

    it("does not gain lore from own damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [robinHoodArcheryContestant],
          play: [{ card: ownDamagedCharacter, damage: 1 }],
          inkwell: robinHoodArcheryContestant.cost,
          deck: 5,
        },
        {},
      );

      expect(testEngine.asPlayerOne().playCard(robinHoodArcheryContestant)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
    });
  });
});
