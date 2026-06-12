import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { luckyRuntOfTheLitter } from "./160-lucky-runt-of-the-litter";

const puppyA = createMockCharacter({
  id: "puppy-a",
  name: "Puppy A",
  cost: 1,
  classifications: ["Storyborn", "Puppy"],
});

const nonMatch = createMockCharacter({
  id: "non-match",
  name: "Non Match",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Lucky - Runt of the Litter", () => {
  it("FOLLOW MY VOICE - on quest, reveals Puppy characters to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: luckyRuntOfTheLitter, isDrying: false }],
      deck: [nonMatch, puppyA],
    });

    expect(testEngine.asPlayerOne().quest(luckyRuntOfTheLitter)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(luckyRuntOfTheLitter),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [puppyA] },
          { zone: "deck-bottom", cards: [nonMatch] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(puppyA)).toBe("hand");
  });
});
