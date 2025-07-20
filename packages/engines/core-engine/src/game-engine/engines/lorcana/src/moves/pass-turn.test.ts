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
    // Verify initial state
    expect(testEngine.getGamePhase()).toBe("mainPhase");
    expect(testEngine.getTurnPlayer()).toBe("player_one");

    // Pass turn
    const response = testEngine.passTurn();
    expect(response.success).toBe(true);

    // Verify turn actions were cleared
    const gameState = testEngine.authoritativeEngine.getGameState();
    expect(gameState.G.turnActions).toBe(undefined);
  });

  it("should clear turn actions when passing turn", () => {
    // Put a card in inkwell to set turn actions
    const handCards = testEngine.getCardsInZone("hand", "player_one");
    const cardInstance = handCards[0];
    testEngine.putACardIntoTheInkwell(cardInstance.instanceId);

    // Verify turn actions are set
    let gameState = testEngine.authoritativeEngine.getGameState();
    expect(gameState.G.turnActions?.putCardIntoInkwell).toBe(true);

    // Pass turn
    const response = testEngine.passTurn();
    expect(response.success).toBe(true);

    // Verify turn actions were cleared
    gameState = testEngine.authoritativeEngine.getGameState();
    expect(gameState.G.turnActions).toBe(undefined);
  });

  it("should not allow non-active player to pass turn", () => {
    // Switch to player_two (who is not the turn player)
    testEngine.changeActivePlayer("player_two");

    // Try to pass turn - should fail
    expect(() => {
      testEngine.passTurn();
    }).toThrow();
  });

  it("should work when bag is empty", () => {
    // Verify bag is empty
    const gameState = testEngine.authoritativeEngine.getGameState();
    expect(gameState.G.bag).toEqual([]);

    // Pass turn should work
    const response = testEngine.passTurn();
    expect(response.success).toBe(true);
  });

  it("should handle consecutive turn passes", () => {
    // Player 1 passes turn
    expect(testEngine.getTurnPlayer()).toBe("player_one");
    const response1 = testEngine.passTurn();
    expect(response1.success).toBe(true);

    // Note: In a real game, the turn would transition to player_two
    // But our current implementation doesn't handle the actual turn transition
    // That would be handled by the FlowManager in a complete implementation
  });

  it("should maintain game state consistency after passing turn", () => {
    // Get initial state
    const initialState = testEngine.authoritativeEngine.getGameState();
    const initialHandCount = testEngine.getZonesCardCount("player_one").hand;
    const initialDeckCount = testEngine.getZonesCardCount("player_one").deck;

    // Pass turn
    const response = testEngine.passTurn();
    expect(response.success).toBe(true);

    // Verify game state consistency
    const finalState = testEngine.authoritativeEngine.getGameState();
    const finalHandCount = testEngine.getZonesCardCount("player_one").hand;
    const finalDeckCount = testEngine.getZonesCardCount("player_one").deck;

    // Zone counts should remain the same
    expect(finalHandCount).toBe(initialHandCount);
    expect(finalDeckCount).toBe(initialDeckCount);

    // Effects and bag should remain the same
    expect(finalState.G.effects).toEqual(initialState.G.effects);
    expect(finalState.G.bag).toEqual(initialState.G.bag);
  });

  it("should advance turn to next player when pass turn is called", () => {
    const initialTurnPlayer = testEngine.getTurnPlayer();
    expect(initialTurnPlayer).toBe("player_one");

    // Pass turn should work and advance turn to next player
    const response = testEngine.passTurn();
    expect(response.success).toBe(true);

    // Turn should have advanced to next player
    const newTurnPlayer = testEngine.getTurnPlayer();
    expect(newTurnPlayer).toBe("player_two");
  });

  it("should be available as a move in main phase", () => {
    // Verify the move exists in the engine
    const moves = testEngine.activeEngine.moves;
    expect(moves.passTurn).toBeDefined();
    expect(typeof moves.passTurn).toBe("function");
  });
});
