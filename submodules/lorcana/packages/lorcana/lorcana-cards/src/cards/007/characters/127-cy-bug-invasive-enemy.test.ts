import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cybugInvasiveEnemy } from "./127-cy-bug-invasive-enemy";

const otherCharacterOne = createMockCharacter({
  id: "cybug-other-character-one",
  name: "Other Character One",
  cost: 1,
  strength: 2,
  willpower: 2,
});

const otherCharacterTwo = createMockCharacter({
  id: "cybug-other-character-two",
  name: "Other Character Two",
  cost: 1,
  strength: 3,
  willpower: 2,
});

describe("Cy-Bug - Invasive Enemy", () => {
  it("gets +1 strength for each other character you have in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: cybugInvasiveEnemy }, otherCharacterOne, otherCharacterTwo],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCardStrength(cybugInvasiveEnemy)).toBe(
      cybugInvasiveEnemy.strength + 2,
    );
  });

  it("does not count itself toward Hive Mind", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [cybugInvasiveEnemy],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCardStrength(cybugInvasiveEnemy)).toBe(
      cybugInvasiveEnemy.strength,
    );
  });
});
