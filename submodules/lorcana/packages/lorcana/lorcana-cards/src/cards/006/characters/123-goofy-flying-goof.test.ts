import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyFlyingGoof } from "./123-goofy-flying-goof";

const exertedDefender = createMockCharacter({
  id: "goofy-flying-goof-exerted-defender",
  name: "Exerted Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const groundedAttacker = createMockCharacter({
  id: "goofy-flying-goof-grounded-attacker",
  name: "Grounded Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "goofy-flying-goof-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "goofy-flying-goof-evasive-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Goofy - Flying Goof", () => {
  it("can challenge the turn it is played because of Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goofyFlyingGoof],
        inkwell: goofyFlyingGoof.cost,
        deck: 5,
      },
      {
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(goofyFlyingGoof)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(goofyFlyingGoof, exertedDefender),
    ).toBeSuccessfulCommand();
  });

  it("cannot be challenged by non-Evasive characters, but can be challenged by Evasive ones", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goofyFlyingGoof, exerted: true }],
        deck: 1,
      },
      {
        play: [groundedAttacker, evasiveAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(testEngine.asPlayerTwo().canChallenge(groundedAttacker, goofyFlyingGoof)).toBe(false);
    expect(testEngine.asPlayerTwo().canChallenge(evasiveAttacker, goofyFlyingGoof)).toBe(true);
  });
});
