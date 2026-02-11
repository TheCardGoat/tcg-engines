import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId } from "../branded-types";
import type { LorcanaState } from "../lorcana-state";

/**
 * Task 1.1: Tests for LorcanaState type structure
 *
 * Validates the complete Lorcana game state type definition:
 * - Lore tracking (Rule 3.1.4 - starts at 0)
 * - Ink management (total and available)
 * - Character states (drying, damage, exerted)
 * - Turn metadata
 * - Challenge state
 *
 * References:
 * - Rule 1.9.1.1 (Win at 20 lore)
 * - Rule 4.2.2.1 (Drying characters)
 * - Rule 4.3.3 (Ink once per turn)
 * - Rule 4.3.6 (Challenge state)
 * - Rule 9 (Damage counters)
 */

// Test helper to create base Lorcana state
function createBaseLorcanaState(
  players: string[],
  overrides?: Partial<LorcanaState>,
): LorcanaState {
  const playerIds = players.map((p) => createPlayerId(p));
  const lore: Record<string, number> = {};
  const available: Record<string, number> = {};
  const total: Record<string, number> = {};

  for (const pid of playerIds) {
    lore[pid] = 0;
    available[pid] = 0;
    total[pid] = 0;
  }

  return {
    currentPlayerIndex: 0,
    lorcana: {
      characterStates: {},
      ink: { available, total },
      lore,
      permanentStates: {},
      turnMetadata: {
        cardsPlayedThisTurn: [],
        charactersQuesting: [],
        inkedThisTurn: false,
      },
    },
    phase: "beginning",
    players: playerIds,
    turnNumber: 1,
    ...overrides,
  };
}

describe("LorcanaState Type Structure", () => {
  it("should have lore tracking for each player", () => {
    const state = createBaseLorcanaState(["player1", "player2"]);
    const [player1, player2] = state.players;

    expect(state.lorcana.lore[player1]).toBe(0);
    expect(state.lorcana.lore[player2]).toBe(0);
  });

  it("should track ink separately for each player", () => {
    const state = createBaseLorcanaState(["player1", "player2"]);
    const [player1, player2] = state.players;

    // Set ink values
    state.lorcana.ink.available[player1] = 3;
    state.lorcana.ink.available[player2] = 2;
    state.lorcana.ink.total[player1] = 5;
    state.lorcana.ink.total[player2] = 4;

    // Available ink is what can be spent this turn
    expect(state.lorcana.ink.available[player1]).toBe(3);
    // Total ink is maximum capacity
    expect(state.lorcana.ink.total[player1]).toBe(5);
  });

  it("should track character states including drying status", () => {
    const state = createBaseLorcanaState(["player1"], { phase: "main" });
    const cardId = createCardId("card-character-1");

    state.lorcana.characterStates[cardId] = {
      playedThisTurn: true, // "drying" character (Rule 4.2.2.1)
      damage: 0,
      exerted: false,
    };

    const charState = state.lorcana.characterStates[cardId];
    expect(charState.playedThisTurn).toBe(true);
    expect(charState.damage).toBe(0);
    expect(charState.exerted).toBe(false);
  });

  it("should track damage on characters", () => {
    const state = createBaseLorcanaState(["player1"], { phase: "main" });
    const cardId = createCardId("card-character-1");

    state.lorcana.characterStates[cardId] = {
      playedThisTurn: false,
      damage: 3, // Has 3 damage counters (Rule 9)
      exerted: true,
    };

    expect(state.lorcana.characterStates[cardId].damage).toBe(3);
  });

  it("should track turn metadata including cards played and characters questing", () => {
    const state = createBaseLorcanaState(["player1"], { phase: "main" });
    const card1 = createCardId("card-1");
    const card2 = createCardId("card-2");

    state.lorcana.turnMetadata = {
      cardsPlayedThisTurn: [card1],
      charactersQuesting: [card2],
      inkedThisTurn: true, // Already inked this turn (Rule 4.3.3)
    };

    expect(state.lorcana.turnMetadata.cardsPlayedThisTurn).toContain(card1);
    expect(state.lorcana.turnMetadata.charactersQuesting).toContain(card2);
    expect(state.lorcana.turnMetadata.inkedThisTurn).toBe(true);
  });

  it("should optionally track challenge state during challenges", () => {
    const state = createBaseLorcanaState(["player1"], { phase: "main" });
    const attacker = createCardId("card-attacker");
    const defender = createCardId("card-defender");

    state.lorcana.challengeState = {
      attacker,
      attackerDamage: 5,
      defender,
      defenderDamage: 3,
    };

    expect(state.lorcana.challengeState).toBeDefined();
    expect(state.lorcana.challengeState?.attacker).toBe(attacker);
    expect(state.lorcana.challengeState?.defender).toBe(defender);
    expect(state.lorcana.challengeState?.attackerDamage).toBe(5);
  });

  it("should track location and item states separately from characters", () => {
    const state = createBaseLorcanaState(["player1"], { phase: "main" });
    const locationId = createCardId("card-location-1");

    state.lorcana.permanentStates[locationId] = {
      damage: 2, // Locations can take damage
    };

    expect(state.lorcana.permanentStates[locationId].damage).toBe(2);
  });

  it("should have required base game properties", () => {
    const state = createBaseLorcanaState(["player1", "player2"]);
    const [player1, player2] = state.players;

    // Verify base game properties exist
    expect(state.players).toEqual([player1, player2]);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.turnNumber).toBe(1);
    expect(state.phase).toBe("beginning");
  });
});
