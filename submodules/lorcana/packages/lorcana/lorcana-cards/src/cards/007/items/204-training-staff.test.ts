import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { trainingStaff } from "./204-training-staff";

const trainedCharacter = createMockCharacter({
  id: "training-staff-trained-character",
  name: "Training Staff Trained Character",
  cost: 2,
});

describe("Training Staff", () => {
  it("gives the chosen character Challenger +2 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [trainingStaff, trainedCharacter],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(trainingStaff, {
        ability: "PRECISION STRIKE",
        targets: [trainedCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: trainedCharacter,
      keyword: "Challenger",
      value: 2,
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).not.toHaveKeyword({
      card: trainedCharacter,
      keyword: "Challenger",
    });
  });

  it("regression: ability works - character gains +2 strength while challenging", () => {
    const defender = createMockCharacter({
      id: "training-staff-defender",
      name: "Defender",
      cost: 2,
      strength: 1,
      willpower: 5,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [trainingStaff, { card: trainedCharacter, isDrying: false }],
      },
      {
        play: [{ card: defender, exerted: true }],
      },
    );

    // Activate Training Staff on the character
    expect(
      testEngine.asPlayerOne().activateAbility(trainingStaff, {
        ability: "PRECISION STRIKE",
        targets: [trainedCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Character should have Challenger +2
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: trainedCharacter,
      keyword: "Challenger",
      value: 2,
    });

    // Challenge - the character's base strength is 2, +2 from Challenger = 4 damage
    expect(testEngine.asPlayerOne().challenge(trainedCharacter, defender)).toBeSuccessfulCommand();

    // Defender should have taken 2 (base) + 2 (Challenger) = 4 damage
    expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(4);
  });
});
