import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { marieFavoredKitten } from "./166-marie-favored-kitten";

const chosenCharacter = createMockCharacter({
  id: "marie-target",
  name: "Chosen Character",
  cost: 2,
  strength: 4,
  willpower: 3,
  lore: 1,
});

describe("Marie - Favored Kitten", () => {
  it("gives chosen character -2 strength this turn when Marie quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marieFavoredKitten, isDrying: false }],
        deck: 1,
      },
      {
        play: [chosenCharacter],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(marieFavoredKitten)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    if (!bagEffect) {
      return;
    }

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(marieFavoredKitten, { targets: [chosenCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(chosenCharacter)).toBe(2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(chosenCharacter)).toBe(4);
  });

  it("can decline the optional ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marieFavoredKitten, isDrying: false }],
        deck: 1,
      },
      {
        play: [chosenCharacter],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(marieFavoredKitten)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    if (!bagEffect) {
      return;
    }

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(marieFavoredKitten, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(chosenCharacter)).toBe(4);
  });
});
