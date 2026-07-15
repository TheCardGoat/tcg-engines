import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { healingDecanter } from "./030-healing-decanter";
import { basilsMagnifyingGlass } from "./166-basils-magnifying-glass";

const firstClue = createMockCharacter({
  id: "basils-magnifying-glass-first",
  name: "First Clue",
  cost: 1,
});

const thirdClue = createMockCharacter({
  id: "basils-magnifying-glass-third",
  name: "Third Clue",
  cost: 1,
});

describe("Basil's Magnifying Glass", () => {
  it("lets you reveal an item from the top 3 cards and put it into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [firstClue, healingDecanter, thirdClue],
        inkwell: 2,
        play: [basilsMagnifyingGlass],
      },
      {
        deck: [],
      },
    );

    expect(testEngine.asPlayerOne().activateAbility(basilsMagnifyingGlass)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(basilsMagnifyingGlass, {
        destinations: [
          { zone: "hand", cards: healingDecanter },
          { zone: "deck-bottom", cards: [firstClue, thirdClue] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(healingDecanter)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(firstClue)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(thirdClue)).toBe("deck");
  });
});
