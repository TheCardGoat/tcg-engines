import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { basilPracticedDetective } from "./153-basil-practiced-detective";

const supportTarget = createMockCharacter({
  id: "support-target",
  name: "Support Target",
  strength: 2,
  willpower: 4,
  cost: 2,
});

describe("Basil - Practiced Detective", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [basilPracticedDetective],
    });

    const cardUnderTest = testEngine.getCardModel(basilPracticedDetective);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("should add Basil's strength to chosen character when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: basilPracticedDetective, isDrying: false }, supportTarget],
    });

    expect(testEngine.asPlayerOne().quest(basilPracticedDetective)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(basilPracticedDetective, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + basilPracticedDetective.strength,
    );
  });

  it("strength bonus lasts only until end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: basilPracticedDetective, isDrying: false }, supportTarget],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(basilPracticedDetective)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(basilPracticedDetective, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + basilPracticedDetective.strength,
    );

    // Pass both turns to advance to next turn
    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    // Strength bonus should have expired
    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });
});
