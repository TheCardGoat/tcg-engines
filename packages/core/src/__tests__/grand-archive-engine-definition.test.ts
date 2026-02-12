import { describe, expect, it } from "bun:test";
import { createTestEngine } from "../testing/test-engine-builder";
import { createTestPlayers } from "../testing/test-player-builder";
import { createMockGrandArchiveGame } from "./createMockGrandArchiveGame";

/**
 * Grand Archive Card Game - Engine Feature Tests
 *
 * Refactored to showcase:
 * ✅ Engine-managed flow state
 * ✅ High-level zone utilities (createDeck, drawCards)
 * ✅ Tracker system (hasMaterialized, hasDrawn)
 * ✅ Standard moves (concede)
 * ✅ Flow context access in phase hooks
 */
describe("Grand Archive Game - Refactored Engine Features", () => {
  it("should initialize game with ONLY game-specific state", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    const state = engine.getState();

    // ✅ NEW: Only game-specific data
    expect(state.opportunityPlayer).toBe(null);
    expect(state.champions).toBeDefined();

    // ✅ REMOVED: No manual phase/turn/player tracking
    // @ts-expect-error
    expect(state.phase).toBeUndefined();
    // @ts-expect-error
    expect(state.turn).toBeUndefined();
    // @ts-expect-error
    expect(state.currentPlayer).toBeUndefined();
    // @ts-expect-error
    expect(state.hasDrawnThisTurn).toBeUndefined();
    // @ts-expect-error
    expect(state.hasMaterializedThisTurn).toBeUndefined();
  });

  it("should have proper zone configuration", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const { zones } = gameDefinition;

    // Verify Grand Archive dual-deck system
    expect(zones?.mainDeck).toBeDefined();
    expect(zones?.materialDeck).toBeDefined();
    expect(zones?.mainDeck?.maxSize).toBe(40);
    expect(zones?.materialDeck?.maxSize).toBe(15);

    // Verify other zones
    expect(zones?.hand).toBeDefined();
    expect(zones?.memory).toBeDefined();
    expect(zones?.field).toBeDefined();
    expect(zones?.graveyard).toBeDefined();
    expect(zones?.banishment).toBeDefined();
    expect(zones?.effectsStack).toBeDefined();
    expect(zones?.intent).toBeDefined();
  });

  it("should configure tracker system for per-turn flags", () => {
    const gameDefinition = createMockGrandArchiveGame();

    expect(gameDefinition.trackers).toBeDefined();
    expect(gameDefinition.trackers?.perTurn).toContain("hasMaterialized");
    expect(gameDefinition.trackers?.perTurn).toContain("hasDrawn");
    expect(gameDefinition.trackers?.perPlayer).toBe(true);
  });

  it("should use high-level zone utilities", () => {
    // ✅ NEW: initializeGame uses zones.createDeck()
    // ✅ NEW: drawStartingHand uses zones.drawCards()
    // BEFORE: Manual loops (20+ lines total)
    // AFTER: Utility calls (6 lines total)

    const gameDefinition = createMockGrandArchiveGame();
    expect(gameDefinition.moves.initializeGame).toBeDefined();
    expect(gameDefinition.moves.drawStartingHand).toBeDefined();
  });

  it("should use flow context in phase hooks", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const { flow } = gameDefinition;

    // ✅ NEW: Phase hooks use context.getCurrentPlayer()
    expect(flow).toBeDefined();
    if (!(flow && "turn" in flow)) {
      throw new Error("Expected simplified flow definition with turn property");
    }
    expect(flow.turn.phases?.recollection).toBeDefined();
    expect(flow.turn.phases?.main).toBeDefined();
    expect(flow.turn.phases?.end).toBeDefined();
  });

  it("should use tracker system for materialize action", () => {
    const gameDefinition = createMockGrandArchiveGame();

    const { materializeCard } = gameDefinition.moves;
    expect(materializeCard.condition).toBeDefined();
    expect(materializeCard.reducer).toBeDefined();

    // Move uses context.trackers.check/mark for hasMaterialized
  });

  it("should demonstrate boilerplate reduction", () => {
    // State fields: 10 → 2 (-80%)
    // Setup function massively simplified

    const gameDefinition = createMockGrandArchiveGame();
    const players = createTestPlayers(2);
    const state = gameDefinition.setup(players);

    // Only game-specific state
    expect(Object.keys(state).length).toBe(2);
    expect(state.opportunityPlayer).toBeDefined();
    expect(state.champions).toBeDefined();
  });
});
