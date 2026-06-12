import { describe, expect, it } from "bun:test";
import {
  LorcanaTestEngine,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { trustyLoyalBloodhound } from "./006-trusty-loyal-bloodhound";

describe("Trusty - Loyal Bloodhound", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [trustyLoyalBloodhound],
    });

    const cardUnderTest = testEngine.getCardModel(trustyLoyalBloodhound);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  it("adds Trusty's strength to another character when questing", () => {
    const supportTarget = createMockCharacter({
      id: "trusty-support-target",
      name: "Support Target",
      cost: 2,
      strength: 3,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: trustyLoyalBloodhound, isDrying: false }, supportTarget],
      deck: 1,
    });

    const targetStrengthBefore = testEngine.asPlayerOne().getCardStrength(supportTarget);

    expect(testEngine.asPlayerOne().quest(trustyLoyalBloodhound)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(trustyLoyalBloodhound, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      targetStrengthBefore + trustyLoyalBloodhound.strength,
    );

    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(targetStrengthBefore);
  });
});
