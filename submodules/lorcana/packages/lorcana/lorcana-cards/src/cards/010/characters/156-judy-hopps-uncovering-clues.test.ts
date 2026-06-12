import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { judyHoppsUncoveringClues } from "./156-judy-hopps-uncovering-clues";

const detectiveCharacter = createMockCharacter({
  id: "detective-match",
  name: "Detective Match",
  cost: 2,
  classifications: ["Storyborn", "Detective"],
});

const nonMatchA = createMockCharacter({
  id: "non-match-a",
  name: "Non Match A",
  cost: 1,
  classifications: ["Storyborn", "Hero"],
});

const nonMatchB = createMockCharacter({
  id: "non-match-b",
  name: "Non Match B",
  cost: 3,
  classifications: ["Dreamborn", "Villain"],
});

describe("Judy Hopps - Uncovering Clues", () => {
  it("THOROUGH INVESTIGATION - on play, reveals a Detective character to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [judyHoppsUncoveringClues],
      inkwell: judyHoppsUncoveringClues.cost,
      deck: [nonMatchA, detectiveCharacter, nonMatchB],
    });

    expect(testEngine.asPlayerOne().playCard(judyHoppsUncoveringClues)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(judyHoppsUncoveringClues),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [detectiveCharacter] },
          { zone: "deck-bottom", cards: [nonMatchB, nonMatchA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(detectiveCharacter)).toBe("hand");
  });

  it("THOROUGH INVESTIGATION - on quest, reveals a Detective character to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [judyHoppsUncoveringClues],
      deck: [nonMatchA, detectiveCharacter, nonMatchB],
    });

    expect(testEngine.asPlayerOne().quest(judyHoppsUncoveringClues)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(judyHoppsUncoveringClues),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [detectiveCharacter] },
          { zone: "deck-bottom", cards: [nonMatchB, nonMatchA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(detectiveCharacter)).toBe("hand");
  });
});
