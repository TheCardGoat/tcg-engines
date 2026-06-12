import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { basilHypnotizedMouse } from "./079-basil-hypnotized-mouse";

// Basil - Hypnotized Mouse: 3 cost, 3/2, 1 lore, Evasive

const nonEvasiveAttacker = createMockCharacter({
  id: "basil-test-non-evasive",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "basil-test-evasive-attacker",
  name: "Evasive Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  abilities: [
    {
      id: "evasive-test",
      keyword: "Evasive",
      type: "keyword",
      text: "Evasive",
    },
  ],
});

describe("Basil - Hypnotized Mouse", () => {
  it("should have Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [basilHypnotizedMouse],
    });

    expect(testEngine.asPlayerOne().hasKeyword(basilHypnotizedMouse, "Evasive")).toBe(true);
  });

  it("cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: basilHypnotizedMouse, exerted: true }],
        deck: 1,
      },
      {
        play: [nonEvasiveAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

    const result = testEngine.asPlayerTwo().challenge(nonEvasiveAttacker, basilHypnotizedMouse);
    expect(result.success).toBe(false);
  });

  it("can be challenged by a character with Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: basilHypnotizedMouse, exerted: true }],
        deck: 1,
      },
      {
        play: [evasiveAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

    expect(
      testEngine.asPlayerTwo().challenge(evasiveAttacker, basilHypnotizedMouse),
    ).toBeSuccessfulCommand();
  });
});
