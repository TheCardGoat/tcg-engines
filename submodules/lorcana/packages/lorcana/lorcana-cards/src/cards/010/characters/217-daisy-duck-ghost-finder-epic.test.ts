import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckGhostFinderEpic } from "./217-daisy-duck-ghost-finder-epic";

const supportTarget = createMockCharacter({
  id: "daisy-ghost-finder-epic-support-target",
  name: "Support Target",
  strength: 2,
  willpower: 4,
  cost: 2,
});

describe("Daisy Duck - Ghost Finder (Epic)", () => {
  it("has Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [daisyDuckGhostFinderEpic],
    });

    const cardUnderTest = testEngine.getCardModel(daisyDuckGhostFinderEpic);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("adds Daisy's strength to a chosen character when she quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: daisyDuckGhostFinderEpic, isDrying: false }, supportTarget],
      deck: 1,
    });

    const targetStrengthBefore = testEngine.asPlayerOne().getCardStrength(supportTarget);

    expect(testEngine.asPlayerOne().quest(daisyDuckGhostFinderEpic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(daisyDuckGhostFinderEpic, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      targetStrengthBefore + daisyDuckGhostFinderEpic.strength,
    );

    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(targetStrengthBefore);
  });
});
