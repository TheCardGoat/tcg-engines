import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { peterPanNeverLanding } from "./091-peter-pan-never-landing";

const nonEvasiveAttacker = createMockCharacter({
  id: "peter-pan-never-landing-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 4,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "peter-pan-never-landing-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 4,
  willpower: 3,
  abilities: [
    {
      id: "peter-pan-never-landing-evasive-attacker-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Peter Pan - Never Landing", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [peterPanNeverLanding],
    });

    const cardUnderTest = testEngine.getCardModel(peterPanNeverLanding);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("cannot be challenged by non-Evasive characters, but can be challenged by Evasive ones", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: peterPanNeverLanding, exerted: true }],
        deck: 1,
      },
      {
        play: [nonEvasiveAttacker, evasiveAttacker],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn().success).toBe(true);
    expect(testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, peterPanNeverLanding)).toBe(
      false,
    );
    expect(testEngine.asPlayerTwo().canChallenge(evasiveAttacker, peterPanNeverLanding)).toBe(true);
  });
});
