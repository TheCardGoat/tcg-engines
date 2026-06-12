import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { annaEagerAcolyte } from "./056-anna-eager-acolyte";

const opponentCharacter = createMockCharacter({
  id: "anna-test-opponent-char",
  name: "Opponent Character",
  strength: 2,
  willpower: 3,
  cost: 2,
});

const opponentCharacter2 = createMockCharacter({
  id: "anna-test-opponent-char-2",
  name: "Opponent Character 2",
  strength: 1,
  willpower: 2,
  cost: 1,
});

describe("Anna - Eager Acolyte", () => {
  it("GROWING POWERS - When you play this character, each opponent chooses and exerts one of their ready characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [annaEagerAcolyte],
        inkwell: annaEagerAcolyte.cost,
        deck: 2,
      },
      {
        play: [opponentCharacter],
        deck: 2,
      },
    );

    // Opponent's character should start ready
    expect(testEngine.isExerted(opponentCharacter)).toBe(false);

    // Play Anna - the triggered ability auto-resolves the bag and creates a pending target selection for the opponent
    expect(testEngine.asPlayerOne().playCard(annaEagerAcolyte)).toBeSuccessfulCommand();

    // Opponent resolves the pending effect by choosing their character to exert
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentCharacter] }),
    ).toBeSuccessfulCommand();

    // Opponent's character should now be exerted
    expect(testEngine.isExerted(opponentCharacter)).toBe(true);
  });

  it("GROWING POWERS - opponent chooses which of their ready characters to exert", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [annaEagerAcolyte],
        inkwell: annaEagerAcolyte.cost,
        deck: 2,
      },
      {
        play: [opponentCharacter, opponentCharacter2],
        deck: 2,
      },
    );

    expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    expect(testEngine.isExerted(opponentCharacter2)).toBe(false);

    expect(testEngine.asPlayerOne().playCard(annaEagerAcolyte)).toBeSuccessfulCommand();

    // Opponent chooses character 2 to exert
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentCharacter2] }),
    ).toBeSuccessfulCommand();

    // Only character 2 should be exerted
    expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    expect(testEngine.isExerted(opponentCharacter2)).toBe(true);
  });

  it("GROWING POWERS - should not require target when opponent has no ready characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [annaEagerAcolyte],
        inkwell: annaEagerAcolyte.cost,
        deck: 2,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 2,
      },
    );

    // Opponent's character is already exerted
    expect(testEngine.isExerted(opponentCharacter)).toBe(true);

    // Play Anna - ability should auto-resolve since there are no valid targets
    expect(testEngine.asPlayerOne().playCard(annaEagerAcolyte)).toBeSuccessfulCommand();

    // No pending effects for opponent since no ready characters exist
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);

    // Character remains exerted
    expect(testEngine.isExerted(opponentCharacter)).toBe(true);
  });
});
