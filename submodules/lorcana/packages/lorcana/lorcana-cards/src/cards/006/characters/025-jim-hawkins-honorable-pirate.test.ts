import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jimHawkinsHonorablePirate } from "./025-jim-hawkins-honorable-pirate";

const pirateA = createMockCharacter({
  id: "pirate-a",
  name: "Pirate A",
  cost: 2,
  classifications: ["Storyborn", "Pirate"],
});

const pirateB = createMockCharacter({
  id: "pirate-b",
  name: "Pirate B",
  cost: 3,
  classifications: ["Dreamborn", "Pirate"],
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
  cost: 4,
  classifications: ["Dreamborn", "Villain"],
});

describe("Jim Hawkins - Honorable Pirate", () => {
  it("HIRE A CREW - reveals Pirate characters to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jimHawkinsHonorablePirate],
      inkwell: jimHawkinsHonorablePirate.cost,
      deck: [nonMatchA, pirateA, pirateB, nonMatchB],
    });

    expect(testEngine.asPlayerOne().playCard(jimHawkinsHonorablePirate)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(jimHawkinsHonorablePirate),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [pirateA, pirateB] },
          { zone: "deck-bottom", cards: [nonMatchB, nonMatchA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(pirateA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(pirateB)).toBe("hand");
  });
});
