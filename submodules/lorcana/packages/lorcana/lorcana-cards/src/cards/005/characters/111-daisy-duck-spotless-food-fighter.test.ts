import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { daisyDuckSpotlessFoodfighter } from "./111-daisy-duck-spotless-food-fighter";

const nonEvasiveAttacker = createMockCharacter({
  id: "daisy-duck-spotless-food-fighter-non-evasive",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "daisy-duck-spotless-food-fighter-evasive",
  name: "Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "daisy-duck-spotless-food-fighter-evasive-kw",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Daisy Duck - Spotless Food-Fighter", () => {
  it("cannot be challenged by non-Evasive characters, but can be challenged by Evasive ones", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: daisyDuckSpotlessFoodfighter, exerted: true }],
        deck: 1,
      },
      {
        play: [nonEvasiveAttacker, evasiveAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(
      testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, daisyDuckSpotlessFoodfighter),
    ).toBe(false);
    expect(
      testEngine.asPlayerTwo().canChallenge(evasiveAttacker, daisyDuckSpotlessFoodfighter),
    ).toBe(true);
  });
});
