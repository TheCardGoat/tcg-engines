import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { guntherInteriorDesigner } from "./072-gunther-interior-designer";

const challenger = createMockCharacter({
  id: "gunther-test-challenger",
  name: "Test Challenger",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
});

const opponentCharacterOne = createMockCharacter({
  id: "gunther-opponent-character-1",
  name: "Opponent Character One",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const opponentCharacterTwo = createMockCharacter({
  id: "gunther-opponent-character-2",
  name: "Opponent Character Two",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Gunther - Interior Designer", () => {
  it("returns the opponent's chosen character to hand when Gunther is challenged and banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [challenger, opponentCharacterOne, opponentCharacterTwo],
        deck: 1,
      },
      {
        play: [{ card: guntherInteriorDesigner, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(challenger, guntherInteriorDesigner),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(guntherInteriorDesigner, {
        targets: [opponentCharacterTwo],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(opponentCharacterTwo)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(opponentCharacterOne)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(guntherInteriorDesigner)).toBe("discard");
  });
});
