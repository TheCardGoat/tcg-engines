import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mirabelMadrigalProphecyFinder } from "./019-mirabel-madrigal-prophecy-finder";

const supportTarget = createMockCharacter({
  id: "support-target",
  name: "Support Target",
  strength: 2,
  willpower: 4,
  cost: 2,
});

describe("Mirabel Madrigal - Prophecy Finder", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mirabelMadrigalProphecyFinder],
    });

    const cardUnderTest = testEngine.getCardModel(mirabelMadrigalProphecyFinder);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("should add Mirabel's strength to chosen character when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mirabelMadrigalProphecyFinder, isDrying: false }, supportTarget],
    });

    expect(testEngine.asPlayerOne().quest(mirabelMadrigalProphecyFinder)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mirabelMadrigalProphecyFinder, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + mirabelMadrigalProphecyFinder.strength,
    );
  });

  it("strength bonus lasts only until end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mirabelMadrigalProphecyFinder, isDrying: false }, supportTarget],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(mirabelMadrigalProphecyFinder)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mirabelMadrigalProphecyFinder, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + mirabelMadrigalProphecyFinder.strength,
    );

    // Pass both turns to advance to next turn
    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    // Strength bonus should have expired
    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });
});
