import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckGhostFinder } from "./141-daisy-duck-ghost-finder";

const supportTarget = createMockCharacter({
  id: "daisy-ghost-finder-support-target",
  name: "Support Target",
  strength: 2,
  willpower: 4,
  cost: 2,
});

describe("Daisy Duck - Ghost Finder", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [daisyDuckGhostFinder],
    });

    const cardUnderTest = testEngine.getCardModel(daisyDuckGhostFinder);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("adds Daisy's strength to a chosen character when she quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: daisyDuckGhostFinder, isDrying: false }, supportTarget],
      deck: 1,
    });

    const targetStrengthBefore = testEngine.asPlayerOne().getCardStrength(supportTarget);

    expect(testEngine.asPlayerOne().quest(daisyDuckGhostFinder)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(daisyDuckGhostFinder, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      targetStrengthBefore + daisyDuckGhostFinder.strength,
    );

    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(targetStrengthBefore);
  });
});
