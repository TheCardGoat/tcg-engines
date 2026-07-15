import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mushuFasttalkingDragon } from "./130-mushu-fast-talking-dragon";

const targetCharacter = createMockCharacter({
  id: "mushu-target-ally",
  name: "Target Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opponentCharacter = createMockCharacter({
  id: "mushu-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Mushu - Fast-Talking Dragon", () => {
  it("LET'S GET THIS SHOW ON THE ROAD - exert to give chosen character Rush this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mushuFasttalkingDragon, { card: targetCharacter, isDrying: true }],
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Rush")).toBe(false);

    const result = testEngine.asPlayerOne().activateAbility(mushuFasttalkingDragon, {
      targets: [targetCharacter],
    });

    expect(result).toBeSuccessfulCommand();

    // Mushu should be exerted after activation
    expect(testEngine.asPlayerOne().isExerted(mushuFasttalkingDragon)).toBe(true);

    // Target should have Rush
    expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Rush")).toBe(true);

    // Target should be able to challenge an exerted opponent
    expect(testEngine.asPlayerOne().canChallenge(targetCharacter, opponentCharacter)).toBe(true);

    // Rush should expire after the turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Rush")).toBe(false);
  });
});
