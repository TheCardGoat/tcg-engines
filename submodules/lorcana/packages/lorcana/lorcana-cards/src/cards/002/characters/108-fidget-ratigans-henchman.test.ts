import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fidgetRatigansHenchman } from "./108-fidget-ratigans-henchman";

const nonEvasiveAttacker = createMockCharacter({
  id: "fidget-ratigans-henchman-non-evasive",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "fidget-ratigans-henchman-evasive",
  name: "Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "fidget-ratigans-henchman-evasive-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Fidget - Ratigan's Henchman", () => {
  it("can only be challenged by characters with Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: fidgetRatigansHenchman, exerted: true }],
        deck: 1,
      },
      {
        play: [nonEvasiveAttacker, evasiveAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, fidgetRatigansHenchman)).toBe(
      false,
    );
    expect(testEngine.asPlayerTwo().canChallenge(evasiveAttacker, fidgetRatigansHenchman)).toBe(
      true,
    );
  });
});
