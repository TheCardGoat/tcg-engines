import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { boltDependableFriend } from "./018-bolt-dependable-friend";

describe("Bolt - Dependable Friend", () => {
  it("adds Bolt's strength to another character when he quests", () => {
    const supportTarget = createMockCharacter({
      id: "bolt-dependable-friend-support-target",
      name: "Support Target",
      cost: 2,
      strength: 3,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: boltDependableFriend, isDrying: false }, supportTarget],
      deck: 1,
    });

    const targetStrengthBefore = testEngine.asPlayerOne().getCardStrength(supportTarget);

    expect(testEngine.asPlayerOne().quest(boltDependableFriend)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(boltDependableFriend, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      targetStrengthBefore + boltDependableFriend.strength,
    );

    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(targetStrengthBefore);
  });
});
