import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fixitFelixJrTrustyBuilder } from "./010-fix-it-felix-jr-trusty-builder";

const otherExertedCharacter = createMockCharacter({
  id: "felix-trusty-builder-other-character",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opposingAttacker = createMockCharacter({
  id: "felix-trusty-builder-opposing-attacker",
  name: "Opposing Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Fix-It Felix, Jr. - Trusty Builder", () => {
  it("forces opponents to challenge Felix if they can", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: fixitFelixJrTrustyBuilder, exerted: true },
          { card: otherExertedCharacter, exerted: true },
        ],
      },
      {
        play: [opposingAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().canChallenge(opposingAttacker, otherExertedCharacter)).toBe(
      false,
    );

    expect(testEngine.asPlayerTwo().canChallenge(opposingAttacker, fixitFelixJrTrustyBuilder)).toBe(
      true,
    );

    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, otherExertedCharacter),
    ).not.toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, fixitFelixJrTrustyBuilder),
    ).toBeSuccessfulCommand();
  });
});
