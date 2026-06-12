import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { squeaksCozyCaterpillar } from "./080-squeaks-cozy-caterpillar";

const nonEvasiveAttacker = createMockCharacter({
  id: "squeaks-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "squeaks-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  abilities: [
    {
      id: "squeaks-evasive-attacker-1",
      keyword: "Evasive",
      type: "keyword",
      text: "Evasive",
    },
  ],
});

describe("Squeaks - Cozy Caterpillar", () => {
  it("has the Evasive keyword", () => {
    expect(testEngine().hasKeyword(squeaksCozyCaterpillar, "Evasive")).toBe(true);
  });

  describe("Evasive — Only characters with Evasive can challenge this character.", () => {
    it("cannot be challenged by a character without Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: nonEvasiveAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: squeaksCozyCaterpillar, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(nonEvasiveAttacker, squeaksCozyCaterpillar),
      ).not.toBeSuccessfulCommand();
    });

    it("can be challenged by a character with Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: evasiveAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: squeaksCozyCaterpillar, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(evasiveAttacker, squeaksCozyCaterpillar),
      ).toBeSuccessfulCommand();
    });
  });
});

function testEngine() {
  return LorcanaMultiplayerTestEngine.createWithFixture({
    play: [squeaksCozyCaterpillar],
    deck: 5,
  });
}
