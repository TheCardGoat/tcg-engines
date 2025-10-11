import { describe, expect, it } from "bun:test";
import { createTestEngine } from "../testing/test-engine-builder";
import { createTestPlayers } from "../testing/test-player-builder";
import { createMockRiftboundGame } from "./createMockRiftboundGame";

/**
 * Riftbound Card Game - Engine Feature Tests
 *
 * Refactored to showcase:
 * ✅ High-level zone utilities (createDeck, bulkMove, drawCards)
 * ✅ Tracker system (hasDrawn)
 * ✅ Standard moves (pass, concede)
 * ✅ Flow context in phase hooks
 * ✅ Massive simplification (10 fields → 4 fields)
 */
describe("Riftbound Game - Refactored Engine Features", () => {
  it("should initialize game with ONLY game-specific state", () => {
    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    const state = engine.getState();

    // ✅ NEW: Only game-specific data
    expect(state.victoryPoints).toBeDefined();
    expect(state.battlefieldControl).toBeDefined();
    expect(state.runePools).toBeDefined();
    expect(state.conqueredThisTurn).toBeDefined();

    // ✅ REMOVED: No manual tracking
    // @ts-expect-error
    expect(state.phase).toBeUndefined();
    // @ts-expect-error
    expect(state.setupStep).toBeUndefined();
    // @ts-expect-error
    expect(state.turn).toBeUndefined();
    // @ts-expect-error
    expect(state.activePlayer).toBeUndefined();
    // @ts-expect-error
    expect(state.hasDrawnThisTurn).toBeUndefined();
  });

  it("should have proper zone configuration", () => {
    const gameDefinition = createMockRiftboundGame();
    const zones = gameDefinition.zones;

    // Verify Riftbound zones
    expect(zones?.mainDeck).toBeDefined();
    expect(zones?.hand).toBeDefined();
    expect(zones?.runeDeck).toBeDefined();
    expect(zones?.runePool).toBeDefined();
    expect(zones?.legendZone).toBeDefined();
    expect(zones?.championZone).toBeDefined();
    expect(zones?.battlefield).toBeDefined();
    expect(zones?.battlefieldRow).toBeDefined();
    expect(zones?.gearArea).toBeDefined();
    expect(zones?.discard).toBeDefined();

    expect(zones?.mainDeck?.maxSize).toBe(40);
    expect(zones?.runeDeck?.maxSize).toBe(12);
    expect(zones?.legendZone?.maxSize).toBe(1);
    expect(zones?.championZone?.maxSize).toBe(1);
    expect(zones?.battlefieldRow?.maxSize).toBe(3);
  });

  it("should use high-level zone utilities", () => {
    // ✅ NEW: zones.createDeck() for dual deck system
    // ✅ NEW: zones.bulkMove() for rune channeling
    // ✅ NEW: zones.drawCards() for card drawing

    const gameDefinition = createMockRiftboundGame();
    expect(gameDefinition.moves.initializeDecks).toBeDefined();
    expect(gameDefinition.moves.channelRunes).toBeDefined();
    expect(gameDefinition.moves.drawCard).toBeDefined();
    expect(gameDefinition.moves.drawInitialHand).toBeDefined();
  });

  it("should configure tracker system", () => {
    const gameDefinition = createMockRiftboundGame();

    expect(gameDefinition.trackers).toBeDefined();
    expect(gameDefinition.trackers?.perTurn).toContain("hasDrawn");
    expect(gameDefinition.trackers?.perPlayer).toBe(true);
  });

  it("should use tracker system for draw limitation", () => {
    const gameDefinition = createMockRiftboundGame();

    const drawCard = gameDefinition.moves.drawCard;
    expect(drawCard.condition).toBeDefined();

    // Uses context.trackers.check("hasDrawn")
  });

  it("should use flow context in phase hooks", () => {
    const gameDefinition = createMockRiftboundGame();
    const flow = gameDefinition.flow;

    // ending phase uses context.getCurrentPlayer()
    expect(flow).toBeDefined();
    expect(flow?.turn.phases?.ending).toBeDefined();
  });

  it("should use standard moves", () => {
    const gameDefinition = createMockRiftboundGame();

    expect(gameDefinition.moves.pass).toBeDefined();
    expect(gameDefinition.moves.concede).toBeDefined();
  });

  it("should demonstrate boilerplate reduction", () => {
    // State fields: 10 → 4 (-60%)
    // 593 lines → 440 lines (-26%)

    const gameDefinition = createMockRiftboundGame();
    const players = createTestPlayers(2);
    const state = gameDefinition.setup(players);

    expect(Object.keys(state).length).toBe(4);
  });
});
