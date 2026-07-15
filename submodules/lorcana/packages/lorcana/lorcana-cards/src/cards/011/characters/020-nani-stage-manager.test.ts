import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { naniStageManager } from "./020-nani-stage-manager";

const cheapCharacter = createMockCharacter({
  id: "cheap-char",
  name: "Cheap Character",
  cost: 2,
  classifications: ["Storyborn", "Ally"],
});

const expensiveA = createMockCharacter({
  id: "expensive-a",
  name: "Expensive A",
  cost: 5,
  classifications: ["Storyborn", "Hero"],
});

const expensiveB = createMockCharacter({
  id: "expensive-b",
  name: "Expensive B",
  cost: 4,
  classifications: ["Dreamborn", "Villain"],
});

const expensiveC = createMockCharacter({
  id: "expensive-c",
  name: "Expensive C",
  cost: 6,
  classifications: ["Storyborn", "Hero"],
});

describe("Nani - Stage Manager", () => {
  it("THAT'S YOUR CUE - reveals a character with cost 2 or less to hand, puts rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [naniStageManager],
      inkwell: naniStageManager.cost,
      deck: [expensiveA, cheapCharacter, expensiveB, expensiveC],
    });

    expect(testEngine.asPlayerOne().playCard(naniStageManager)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(naniStageManager)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [cheapCharacter] },
          { zone: "deck-bottom", cards: [expensiveC, expensiveB, expensiveA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
  });

  it("THAT'S YOUR CUE - allows putting all cards on bottom if no valid character is chosen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [naniStageManager],
      inkwell: naniStageManager.cost,
      deck: [expensiveA, cheapCharacter, expensiveB, expensiveC],
    });

    expect(testEngine.asPlayerOne().playCard(naniStageManager)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(naniStageManager)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [] },
          {
            zone: "deck-bottom",
            cards: [expensiveC, expensiveB, cheapCharacter, expensiveA],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("deck");
  });

  it("THAT'S YOUR CUE - cannot tutor a character with cost greater than 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [naniStageManager],
      inkwell: naniStageManager.cost,
      deck: [expensiveA, expensiveB, expensiveC, cheapCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(naniStageManager)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(naniStageManager)).toBeSuccessfulCommand();

    // Only cheapCharacter (cost 2) can go to hand, not the expensive ones
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [cheapCharacter] },
          { zone: "deck-bottom", cards: [expensiveC, expensiveB, expensiveA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(expensiveA)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(expensiveB)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(expensiveC)).toBe("deck");
  });
});
