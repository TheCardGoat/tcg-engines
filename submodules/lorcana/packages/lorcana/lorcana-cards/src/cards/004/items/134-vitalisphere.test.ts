import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { vitalisphere } from "./134-vitalisphere";

const freshAttacker = createMockCharacter({
  id: "vitalisphere-attacker",
  name: "Fresh Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const exertedDefender = createMockCharacter({
  id: "vitalisphere-defender",
  name: "Exerted Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Vitalisphere", () => {
  it("gives the chosen character Rush and +2 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        deck: 1,
        play: [vitalisphere, { card: freshAttacker, isDrying: true }],
      },
      {
        deck: 1,
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
      },
    );

    const baseStrength = testEngine.asPlayerOne().getCardStrength(freshAttacker);
    expect(testEngine.asPlayerOne().canChallenge(freshAttacker, exertedDefender)).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(vitalisphere, {
        targets: [freshAttacker],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(freshAttacker, "Rush")).toBe(true);
    expect(testEngine.asPlayerOne().getCardStrength(freshAttacker)).toBe(baseStrength + 2);
    expect(testEngine.asPlayerOne().canChallenge(freshAttacker, exertedDefender)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(vitalisphere)).toBe("discard");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(freshAttacker, "Rush")).toBe(false);
    expect(testEngine.asPlayerOne().getCardStrength(freshAttacker)).toBe(baseStrength);
  });
});
