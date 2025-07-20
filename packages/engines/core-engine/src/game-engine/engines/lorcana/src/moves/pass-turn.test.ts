import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  LorcanaTestEngine,
  testCharacterCard,
} from "../testing/lorcana-test-engine";

describe("Move: Pass Turn", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    // Set up game in main phase where pass turn is allowed
    testEngine = new LorcanaTestEngine(
      { hand: [testCharacterCard], deck: 5, inkwell: [] },
      { hand: [testCharacterCard], deck: 5, inkwell: [] },
    );

    // Verify we're in the main game phase
    expect(testEngine.getGameSegment()).toBe("duringGame");
    expect(testEngine.getGamePhase()).toBe("mainPhase");
    expect(testEngine.getTurnPlayer()).toBe("player_one");

    // Make sure player_one is active
    testEngine.changeActivePlayer("player_one");
  });

  afterEach(() => {
    testEngine.dispose();
  });

  it("should successfully pass turn during main phase", () => {
    expect(testEngine.getNumTurns()).toBe(1);
    expect(testEngine.getNumMoves()).toBe(0);
    expect(testEngine.getNumTurnMoves()).toBe(0);

    const p1Response = testEngine.passTurn();
    expect(p1Response.success).toBe(true);

    expect(testEngine.getTurnPlayer()).toBe("player_two");
    expect(testEngine.getNumTurnMoves()).toBe(0);
    expect(testEngine.getNumTurns()).toBe(2);
    expect(testEngine.getNumMoves()).toBe(1);
  });

  it("should handle consecutive turn passes", () => {
    expect(testEngine.getNumTurns()).toBe(1);
    expect(testEngine.getNumMoves()).toBe(0);
    expect(testEngine.getNumTurnMoves()).toBe(0);

    const p1Response = testEngine.passTurn();
    expect(p1Response.success).toBe(true);

    expect(testEngine.getTurnPlayer()).toBe("player_two");
    expect(testEngine.getNumTurns()).toBe(2);
    expect(testEngine.getNumMoves()).toBe(1);
    expect(testEngine.getNumTurnMoves()).toBe(0);

    testEngine.changeActivePlayer("player_two");
    const p2Response = testEngine.passTurn();
    expect(p2Response.success).toBe(true);

    expect(testEngine.getTurnPlayer()).toBe("player_one");
    expect(testEngine.getNumTurns()).toBe(3);
    expect(testEngine.getNumMoves()).toBe(2);
    expect(testEngine.getNumTurnMoves()).toBe(0);
  });

  it("should request targets when an end of turn trigger is on the bag", () => {});

  it("should end game if player doesn't have cards to draw", () => {});

  it("should request targets when an beginning of turn trigger is on the bag", () => {});

  it("should not allow non-active player to pass turn", () => {
    // Switch to player_two (who is not the turn player)
    testEngine.changeActivePlayer("player_two");

    // Try to pass turn - should fail
    expect(() => {
      testEngine.passTurn();
    }).toThrow();
  });

  it("should be available as a move in main phase", () => {
    // Verify the move exists in the engine
    const moves = testEngine.activeEngine.moves;
    expect(moves.passTurn).toBeDefined();
    expect(typeof moves.passTurn).toBe("function");
  });
});
