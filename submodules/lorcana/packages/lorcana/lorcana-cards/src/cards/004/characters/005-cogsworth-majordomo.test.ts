import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cogsworthMajordomo } from "./005-cogsworth-majordomo";

const chosenCharacter = createMockCharacter({
  id: "cogsworth-target",
  name: "Chosen Character",
  cost: 2,
  strength: 4,
  willpower: 3,
  lore: 1,
});

describe("Cogsworth - Majordomo", () => {
  it("gives the chosen character -2 strength until the start of your next turn when Cogsworth quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: cogsworthMajordomo, isDrying: false }],
        deck: 2,
      },
      {
        play: [chosenCharacter],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().quest(cogsworthMajordomo)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    if (!bagEffect) {
      return;
    }

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(cogsworthMajordomo, { targets: [chosenCharacter] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(chosenCharacter)).toBe(2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(chosenCharacter)).toBe(2);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(chosenCharacter)).toBe(4);
  });
});
