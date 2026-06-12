import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { todNimbleFox } from "./072-tod-nimble-fox";

const nonEvasiveAttacker = createMockCharacter({
  id: "tod-nimble-fox-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "tod-nimble-fox-evasive-attacker",
  name: "Evasive Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  abilities: [{ type: "keyword", keyword: "Evasive", text: "Evasive" }],
});

describe("Tod - Nimble Fox", () => {
  describe("Evasive - Only characters with Evasive can challenge this character", () => {
    it("cannot be challenged by a character without Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: nonEvasiveAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: todNimbleFox, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(nonEvasiveAttacker, todNimbleFox),
      ).not.toBeSuccessfulCommand();
    });

    it("can be challenged by a character with Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: evasiveAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: todNimbleFox, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(evasiveAttacker, todNimbleFox),
      ).toBeSuccessfulCommand();
    });

    it("quests for 2 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: todNimbleFox, isDrying: false }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(todNimbleFox)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
    });
  });
});
