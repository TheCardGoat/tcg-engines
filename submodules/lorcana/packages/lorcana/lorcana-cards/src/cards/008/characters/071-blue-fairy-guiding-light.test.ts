import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { blueFairyGuidingLight } from "./071-blue-fairy-guiding-light";

describe("Blue Fairy - Guiding Light", () => {
  it("cannot be challenged by a non-Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          createMockCharacter({
            id: "blue-fairy-attacker",
            name: "Attacker",
            cost: 2,
            strength: 2,
            willpower: 2,
            lore: 1,
          }),
        ],
        deck: 1,
      },
      {
        play: [{ card: blueFairyGuidingLight, exerted: true }],
        deck: 1,
      },
    );

    const challengeMove = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "challenge");

    expect(challengeMove).toBeUndefined();
  });

  it("adds her strength to another character when she quests", () => {
    const supportTarget = createMockCharacter({
      id: "blue-fairy-support-target",
      name: "Support Target",
      cost: 2,
      strength: 3,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: blueFairyGuidingLight, isDrying: false }, supportTarget],
      deck: 1,
    });

    const targetStrengthBefore = testEngine.asPlayerOne().getCardStrength(supportTarget);

    expect(testEngine.asPlayerOne().quest(blueFairyGuidingLight)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(blueFairyGuidingLight, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      targetStrengthBefore + blueFairyGuidingLight.strength,
    );

    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(targetStrengthBefore);
  });
});
