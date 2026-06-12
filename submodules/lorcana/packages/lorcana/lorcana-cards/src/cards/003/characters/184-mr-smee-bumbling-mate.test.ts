import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrSmeeBumblingMate } from "./184-mr-smee-bumbling-mate";

const friendlyCaptain = createMockCharacter({
  id: "smee-friendly-captain",
  name: "Friendly Captain",
  cost: 3,
  classifications: ["Captain"],
});

const opposingCaptain = createMockCharacter({
  id: "smee-opposing-captain",
  name: "Opposing Captain",
  cost: 3,
  classifications: ["Captain"],
});

describe("Mr. Smee - Bumbling Mate", () => {
  it("deals 1 damage to itself at the end of your turn when exerted and you do not control a Captain", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mrSmeeBumblingMate],
    });
    const smeeId = testEngine.findCardInstanceId(mrSmeeBumblingMate, "play", "p1");

    testEngine.asServer().manualExertCard(smeeId);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(mrSmeeBumblingMate)).toBe(1);
  });

  it("still damages itself when only the opponent controls a Captain", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mrSmeeBumblingMate],
      },
      {
        play: [opposingCaptain],
      },
    );
    const smeeId = testEngine.findCardInstanceId(mrSmeeBumblingMate, "play", "p1");

    testEngine.asServer().manualExertCard(smeeId);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(mrSmeeBumblingMate)).toBe(1);
  });

  it("does not damage itself when you control a Captain", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mrSmeeBumblingMate, friendlyCaptain],
    });
    const smeeId = testEngine.findCardInstanceId(mrSmeeBumblingMate, "play", "p1");

    testEngine.asServer().manualExertCard(smeeId);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(mrSmeeBumblingMate)).toBe(0);
  });

  it("does not damage itself while ready even if you do not control a Captain", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mrSmeeBumblingMate],
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(mrSmeeBumblingMate)).toBe(0);
  });
});
