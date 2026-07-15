import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { benEccentricRobot } from "./137-ben-eccentric-robot";

const supportTarget = createMockCharacter({
  id: "ben-support-target",
  name: "Support Target",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("B.E.N. - Eccentric Robot", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [benEccentricRobot],
    });

    const cardUnderTest = testEngine.getCardModel(benEccentricRobot);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("should trigger Support when questing, adding strength to chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [benEccentricRobot, supportTarget],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(benEccentricRobot)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(benEccentricRobot, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + benEccentricRobot.strength,
    );
  });

  it("should allow declining the Support ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [benEccentricRobot, supportTarget],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(benEccentricRobot)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(benEccentricRobot, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    // Strength should remain unchanged
    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(supportTarget.strength);
  });
});
