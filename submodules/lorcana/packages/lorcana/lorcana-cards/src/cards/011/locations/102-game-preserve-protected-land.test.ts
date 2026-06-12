import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gamePreserveProtectedLand } from "./102-game-preserve-protected-land";

const groundedScout = createMockCharacter({
  id: "game-preserve-grounded-scout",
  name: "Grounded Scout",
  cost: 2,
});

const evasiveScout = createMockCharacter({
  id: "game-preserve-evasive-scout",
  name: "Evasive Scout",
  cost: 2,
  abilities: [{ type: "keyword", keyword: "Evasive", text: "Evasive", id: "evasive-scout" }],
});

const groundedAttacker = createMockCharacter({
  id: "game-preserve-grounded-attacker",
  name: "Grounded Attacker",
  cost: 3,
  strength: 4,
});

const evasiveAttacker = createMockCharacter({
  id: "game-preserve-evasive-attacker",
  name: "Evasive Attacker",
  cost: 3,
  strength: 3,
  abilities: [{ type: "keyword", keyword: "Evasive", text: "Evasive", id: "evasive-attacker" }],
});

describe("Game Preserve - Protected Land", () => {
  it("does not have Evasive when no character is at the location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gamePreserveProtectedLand],
    });

    expect(testEngine.asPlayerOne().hasKeyword(gamePreserveProtectedLand, "Evasive")).toBe(false);
  });

  it("does not gain Evasive when a character without Evasive is here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gamePreserveProtectedLand, groundedScout],
      inkwell: gamePreserveProtectedLand.moveCost,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(groundedScout, gamePreserveProtectedLand),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(gamePreserveProtectedLand, "Evasive")).toBe(false);
  });

  it("gains Evasive when a character with Evasive is here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gamePreserveProtectedLand, evasiveScout],
      inkwell: gamePreserveProtectedLand.moveCost,
    });

    expect(testEngine.asPlayerOne().hasKeyword(gamePreserveProtectedLand, "Evasive")).toBe(false);
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(evasiveScout, gamePreserveProtectedLand),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(gamePreserveProtectedLand, "Evasive")).toBe(true);
  });

  it("is only challengeable by characters with Evasive when the condition is met", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [gamePreserveProtectedLand, evasiveScout],
        inkwell: gamePreserveProtectedLand.moveCost,
      },
      {
        play: [groundedAttacker, evasiveAttacker],
      },
    );

    expect(
      testEngine.asServer().manualExertCard(gamePreserveProtectedLand),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().canChallenge(groundedAttacker, gamePreserveProtectedLand)).toBe(
      true,
    );
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(evasiveScout, gamePreserveProtectedLand),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().canChallenge(groundedAttacker, gamePreserveProtectedLand)).toBe(
      false,
    );
    expect(testEngine.asPlayerTwo().canChallenge(evasiveAttacker, gamePreserveProtectedLand)).toBe(
      true,
    );
  });
});
