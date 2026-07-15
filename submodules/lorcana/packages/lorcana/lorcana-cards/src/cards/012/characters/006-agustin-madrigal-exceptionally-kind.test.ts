import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { agustinMadrigalExceptionallyKind } from "./006-agustin-madrigal-exceptionally-kind";

const supportTarget = createMockCharacter({
  id: "agustin-support-target",
  name: "Support Target",
  strength: 1,
  willpower: 4,
  cost: 2,
});

describe("Agustin Madrigal - Exceptionally Kind", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [agustinMadrigalExceptionallyKind],
    });

    const cardUnderTest = testEngine.getCardModel(agustinMadrigalExceptionallyKind);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("should add Agustin's strength to chosen character when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: agustinMadrigalExceptionallyKind, isDrying: false }, supportTarget],
    });

    expect(
      testEngine.asPlayerOne().quest(agustinMadrigalExceptionallyKind),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(agustinMadrigalExceptionallyKind, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + agustinMadrigalExceptionallyKind.strength,
    );
  });

  it("strength bonus lasts only until end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: agustinMadrigalExceptionallyKind, isDrying: false }, supportTarget],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().quest(agustinMadrigalExceptionallyKind),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(agustinMadrigalExceptionallyKind, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + agustinMadrigalExceptionallyKind.strength,
    );

    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });
});
