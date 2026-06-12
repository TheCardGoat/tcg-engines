import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mulanConsiderateDiplomat } from "./142-mulan-considerate-diplomat";

const princessCharacter = createMockCharacter({
  id: "princess-match",
  name: "Princess Match",
  cost: 2,
  classifications: ["Storyborn", "Princess"],
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

const nonMatchC = createMockCharacter({
  id: "non-match-c",
  name: "Non Match C",
  cost: 4,
  classifications: ["Storyborn", "Ally"],
});

describe("Mulan - Considerate Diplomat", () => {
  it("IMPERIAL INVITATION - on quest, reveals a Princess character to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mulanConsiderateDiplomat, isDrying: false }],
      deck: [nonMatchA, princessCharacter, nonMatchB, nonMatchC],
    });

    expect(testEngine.asPlayerOne().quest(mulanConsiderateDiplomat)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mulanConsiderateDiplomat),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [princessCharacter] },
          { zone: "deck-bottom", cards: [nonMatchC, nonMatchB, nonMatchA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(princessCharacter)).toBe("hand");
  });
});
