import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseTinyTimsMother } from "./141-minnie-mouse-tiny-tims-mother";

const supportTarget = createMockCharacter({
  id: "support-target",
  name: "Support Target",
  strength: 1,
  willpower: 4,
  cost: 2,
});

describe("Minnie Mouse - Tiny Tim's Mother", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [minnieMouseTinyTimsMother],
    });

    const cardUnderTest = testEngine.getCardModel(minnieMouseTinyTimsMother);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("should add Minnie's strength to chosen character when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: minnieMouseTinyTimsMother, isDrying: false }, supportTarget],
    });

    expect(testEngine.asPlayerOne().quest(minnieMouseTinyTimsMother)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(minnieMouseTinyTimsMother, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + minnieMouseTinyTimsMother.strength,
    );
  });

  it("strength bonus lasts only until end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: minnieMouseTinyTimsMother, isDrying: false }, supportTarget],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(minnieMouseTinyTimsMother)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(minnieMouseTinyTimsMother, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + minnieMouseTinyTimsMother.strength,
    );

    // Pass both turns to advance to next turn
    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    // Strength bonus should have expired
    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });
});
