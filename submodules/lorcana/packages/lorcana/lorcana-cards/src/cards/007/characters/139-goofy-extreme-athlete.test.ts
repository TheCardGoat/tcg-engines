import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyExtremeAthlete } from "./139-goofy-extreme-athlete";

const nonEvasiveAttacker = createMockCharacter({
  id: "goofy-extreme-athlete-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "goofy-extreme-athlete-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "goofy-extreme-athlete-evasive-attacker-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const teammate = createMockCharacter({
  id: "goofy-extreme-athlete-teammate",
  name: "Teammate",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const defender = createMockCharacter({
  id: "goofy-extreme-athlete-defender",
  name: "Defender",
  cost: 3,
  strength: 1,
  willpower: 7,
});

describe("Goofy - Extreme Athlete", () => {
  it("cannot be challenged by non-Evasive characters, but can be challenged by Evasive ones", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goofyExtremeAthlete, exerted: true }],
        deck: 1,
      },
      {
        play: [nonEvasiveAttacker, evasiveAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, goofyExtremeAthlete)).toBe(
      false,
    );
    expect(testEngine.asPlayerTwo().canChallenge(evasiveAttacker, goofyExtremeAthlete)).toBe(true);
  });

  it("STAR POWER gives your other characters +1 lore this turn when Goofy challenges", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: goofyExtremeAthlete, isDrying: false },
          { card: teammate, isDrying: false },
        ],
        deck: 2,
      },
      {
        play: [{ card: defender, exerted: true }],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().getCard(goofyExtremeAthlete).lore).toBe(
      goofyExtremeAthlete.lore,
    );
    expect(testEngine.asPlayerOne().getCard(teammate).lore).toBe(teammate.lore);

    expect(
      testEngine.asPlayerOne().challenge(goofyExtremeAthlete, defender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(goofyExtremeAthlete).lore).toBe(
      goofyExtremeAthlete.lore,
    );
    expect(testEngine.asPlayerOne().getCard(teammate).lore).toBe(teammate.lore + 1);

    testEngine.asServer().passTurn();
    testEngine.asServer().passTurn();

    expect(testEngine.asPlayerOne().getCard(teammate).lore).toBe(teammate.lore);
  });
});
