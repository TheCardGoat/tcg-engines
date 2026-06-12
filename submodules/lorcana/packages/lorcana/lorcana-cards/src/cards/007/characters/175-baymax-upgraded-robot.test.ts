import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { baymaxUpgradedRobot } from "./175-baymax-upgraded-robot";

const floodbornCharacter = createMockCharacter({
  id: "floodborn-match",
  name: "Floodborn Match",
  cost: 3,
  classifications: ["Floodborn", "Hero"],
});

const nonMatchA = createMockCharacter({
  id: "non-match-a",
  name: "Non Match A",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const nonMatchB = createMockCharacter({
  id: "non-match-b",
  name: "Non Match B",
  cost: 1,
  classifications: ["Dreamborn", "Villain"],
});

const nonMatchC = createMockCharacter({
  id: "non-match-c",
  name: "Non Match C",
  cost: 4,
  classifications: ["Storyborn", "Ally"],
});

describe("Baymax - Upgraded Robot", () => {
  it("ADVANCED SCANNER - reveals a Floodborn character to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [baymaxUpgradedRobot],
      inkwell: baymaxUpgradedRobot.cost,
      deck: [nonMatchA, floodbornCharacter, nonMatchB, nonMatchC],
    });

    expect(testEngine.asPlayerOne().playCard(baymaxUpgradedRobot)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(baymaxUpgradedRobot),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [floodbornCharacter] },
          { zone: "deck-bottom", cards: [nonMatchC, nonMatchB, nonMatchA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(floodbornCharacter)).toBe("hand");
  });
});
