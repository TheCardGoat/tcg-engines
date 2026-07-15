import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyDaredevil } from "./111-goofy-daredevil";

const nonEvasiveAttacker = createMockCharacter({
  id: "goofy-daredevil-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "goofy-daredevil-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "goofy-daredevil-evasive-attacker-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Goofy - Daredevil", () => {
  it("cannot be challenged by non-Evasive characters, but can be challenged by Evasive ones", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goofyDaredevil, exerted: true }],
        deck: 1,
      },
      {
        play: [nonEvasiveAttacker, evasiveAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, goofyDaredevil)).toBe(false);
    expect(testEngine.asPlayerTwo().canChallenge(evasiveAttacker, goofyDaredevil)).toBe(true);
  });
});
