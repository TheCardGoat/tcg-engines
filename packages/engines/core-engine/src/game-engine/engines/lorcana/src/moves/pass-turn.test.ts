import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { donaldDuckPerfectGentleman } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { goofyGroundbreakingChef } from "@lorcanito/lorcana-engine/cards/008/characters/characters";
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

  describe.only("Triggered Effects on passing turn", () => {
    it("At the start of your turn", () => {
      const testEngine = new LorcanaTestEngine(
        {
          deck: 5,
        },
        {
          deck: 5,
          play: [donaldDuckPerfectGentleman],
        },
      );
      expect(testEngine.getNumTurns()).toBe(1);
      testEngine.passTurn();
      expect(testEngine.getNumTurns()).toBe(2);

      // For now we're adding two items, but in the future we'd like to have only one item. Given that there's just one ability with two targets
      expect(testEngine.bag).toHaveLength(2);

      // According to Lorcana rules 8.7.4-8.7.5, the trigger controller (player_two, who owns Donald Duck)
      // resolves all of their triggers first. Since both triggers are controlled by player_two,
      // only player_two should be able to resolve both triggers.
      testEngine.changeActivePlayer("player_two");
      testEngine.resolveBag();
      expect(testEngine.bag).toHaveLength(1);

      // player_two resolves their second trigger
      testEngine.resolveBag();
      expect(testEngine.bag).toHaveLength(0);
    });

    it("At the end of your turn", () => {
      const testEngine = new LorcanaTestEngine(
        {
          deck: 5,
          play: [goofyGroundbreakingChef],
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.getNumTurns()).toBe(1);
      testEngine.passTurn();
      // At the end of the turn, Goofy Groundbreaking Chef should trigger before turn ends
      expect(testEngine.getNumTurns()).toBe(1);

      expect(testEngine.bag).toHaveLength(1);

      testEngine.changeActivePlayer("player_one");
      testEngine.resolveBag();

      // Turn should end after resolving the bag
      expect(testEngine.getNumTurns()).toBe(2);
      expect(testEngine.bag).toHaveLength(0);
    });

    it.skip("should not allow passing turn if abilities are pending", () => {});
  });
});
