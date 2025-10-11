import { describe, expect, it } from "bun:test";
import { createTestEngine } from "../testing/test-engine-builder";
import { createTestPlayers } from "../testing/test-player-builder";
import { createMockLorcanaGame } from "./createMockLorcanaGame";

/**
 * Lorcana Card Game - Engine Feature Tests
 *
 * Refactored to showcase:
 * ✅ Engine-managed flow state
 * ✅ High-level zone utilities (drawCards, mulligan)
 * ✅ Tracker system (hasInked, per-card quested tracking)
 * ✅ Standard moves (passTurn, concede)
 * ✅ Simplified state (8 fields → 3 fields)
 */
describe("Lorcana Game - Refactored Engine Features", () => {
	it("should initialize game with ONLY game-specific state", () => {
		const gameDefinition = createMockLorcanaGame();
		const players = createTestPlayers(2);
		const engine = createTestEngine(gameDefinition, players);

		const state = engine.getState();

		// ✅ NEW: Only game-specific data
		expect(state.effects).toBeDefined();
		expect(state.bag).toBeDefined();
		expect(state.loreScores).toBeDefined();

		// ✅ REMOVED: No manual tracking
		// @ts-expect-error
		expect(state.activePlayerId).toBeUndefined();
		// @ts-expect-error
		expect(state.turnNumber).toBeUndefined();
		// @ts-expect-error
		expect(state.gamePhase).toBeUndefined();
		// @ts-expect-error
		expect(state.firstPlayerDetermined).toBeUndefined();
	});

	it("should have proper zone configuration", () => {
		const gameDefinition = createMockLorcanaGame();
		const zones = gameDefinition.zones;

		expect(zones?.deck).toBeDefined();
		expect(zones?.hand).toBeDefined();
		expect(zones?.inkwell).toBeDefined();
		expect(zones?.play).toBeDefined();
		expect(zones?.discard).toBeDefined();

		expect(zones?.deck?.maxSize).toBe(60);
		expect(zones?.inkwell?.faceDown).toBe(true);
	});

	it("should use high-level zone utilities", () => {
		// ✅ NEW: zones.mulligan() for alterHand
		// ✅ NEW: zones.drawCards() for drawing

		const gameDefinition = createMockLorcanaGame();
		expect(gameDefinition.moves.alterHand).toBeDefined();
		expect(gameDefinition.moves.drawCards).toBeDefined();
	});

	it("should configure tracker system for inking", () => {
		const gameDefinition = createMockLorcanaGame();

		expect(gameDefinition.trackers).toBeDefined();
		expect(gameDefinition.trackers?.perTurn).toContain("hasInked");
		expect(gameDefinition.trackers?.perPlayer).toBe(true);
	});

	it("should use tracker system for ink and quest actions", () => {
		const gameDefinition = createMockLorcanaGame();

		// Inking uses hasInked tracker
		const putInkwell = gameDefinition.moves.putACardIntoTheInkwell;
		expect(putInkwell.condition).toBeDefined();

		// Questing uses per-card trackers
		const quest = gameDefinition.moves.quest;
		expect(quest.condition).toBeDefined();
	});

	it("should use standard moves", () => {
		const gameDefinition = createMockLorcanaGame();

		expect(gameDefinition.moves.passTurn).toBeDefined();
		expect(gameDefinition.moves.concede).toBeDefined();
	});

	it("should demonstrate boilerplate reduction", () => {
		// State fields: 8 → 3 (-62%)
		// Eliminated player zones from state (engine manages)

		const gameDefinition = createMockLorcanaGame();
		const players = createTestPlayers(2);
		const state = gameDefinition.setup(players);

		expect(Object.keys(state).length).toBe(3);
	});
});
