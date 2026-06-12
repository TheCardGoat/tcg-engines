import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pegasusSearchingHighAndLow } from "./106-pegasus-searching-high-and-low";

const nonEvasiveAttacker = createMockCharacter({
  id: "pegasus-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "pegasus-evasive-attacker",
  name: "Evasive Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  abilities: [{ type: "keyword", keyword: "Evasive", text: "Evasive" }],
});

describe("Pegasus - Searching High and Low", () => {
  describe("Evasive - Only characters with Evasive can challenge this character", () => {
    it("cannot be challenged by a character without Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: nonEvasiveAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: pegasusSearchingHighAndLow, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(nonEvasiveAttacker, pegasusSearchingHighAndLow),
      ).not.toBeSuccessfulCommand();
    });

    it("can be challenged by a character with Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: evasiveAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: pegasusSearchingHighAndLow, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(evasiveAttacker, pegasusSearchingHighAndLow),
      ).toBeSuccessfulCommand();
    });

    it("quests for 1 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: pegasusSearchingHighAndLow, isDrying: false }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(pegasusSearchingHighAndLow)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
    });
  });
});
