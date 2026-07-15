import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyGhostHunterEpic } from "./205-goofy-ghost-hunter-epic";

const opposingCharacter = createMockCharacter({
  id: "goofy-ghost-hunter-epic-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Goofy - Ghost Hunter (Epic)", () => {
  it("gives the chosen opposing character -1 strength when its play trigger resolves", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [goofyGhostHunterEpic],
        inkwell: goofyGhostHunterEpic.cost,
        deck: 1,
      },
      {
        play: [opposingCharacter],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(goofyGhostHunterEpic, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goofyGhostHunterEpic),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
      opposingCharacter.strength - 1,
    );
  });
});
