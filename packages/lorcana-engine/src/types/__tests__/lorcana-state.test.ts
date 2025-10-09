import { describe, expect, it } from "bun:test";
import { createPlayerId } from "../branded-types";
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

describe("LorcanaState Type Structure", () => {
  it("should have lore tracking for each player", () => {
    const player1 = createPlayerId("player1");
    const player2 = createPlayerId("player2");

    const state: LorcanaState = {
      players: [player1, player2],
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "beginning",
      lorcana: {
        lore: {
          [player1]: 0,
          [player2]: 0,
        },
        ink: {
          available: { [player1]: 0, [player2]: 0 },
          total: { [player1]: 0, [player2]: 0 },
        },
        turnMetadata: {
          cardsPlayedThisTurn: [],
          charactersQuesting: [],
          inkedThisTurn: false,
        },
        characterStates: {},
        permanentStates: {},
      },
    };

    expect(state.lorcana.lore[player1]).toBe(0);
    expect(state.lorcana.lore[player2]).toBe(0);
  });

  it("should track ink separately for each player", () => {
    const player1 = createPlayerId("player1");
    const player2 = createPlayerId("player2");

    const state: LorcanaState = {
      players: [player1, player2],
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "beginning",
      lorcana: {
        lore: { [player1]: 0, [player2]: 0 },
        ink: {
          available: { [player1]: 3, [player2]: 2 },
          total: { [player1]: 5, [player2]: 4 },
        },
        turnMetadata: {
          cardsPlayedThisTurn: [],
          charactersQuesting: [],
          inkedThisTurn: false,
        },
        characterStates: {},
        permanentStates: {},
      },
    };

    // Available ink is what can be spent this turn
    expect(state.lorcana.ink.available[player1]).toBe(3);
    // Total ink is maximum capacity
    expect(state.lorcana.ink.total[player1]).toBe(5);
  });

  it("should track character states including drying status", () => {
    const player1 = createPlayerId("player1");
    const cardId = "card-character-1";

    const state: LorcanaState = {
      players: [player1],
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "main",
      lorcana: {
        lore: { [player1]: 0 },
        ink: {
          available: { [player1]: 0 },
          total: { [player1]: 0 },
        },
        turnMetadata: {
          cardsPlayedThisTurn: [],
          charactersQuesting: [],
          inkedThisTurn: false,
        },
        characterStates: {
          [cardId]: {
            playedThisTurn: true, // "drying" character (Rule 4.2.2.1)
            damage: 0,
            exerted: false,
          },
        },
        permanentStates: {},
      },
    };

    const charState = state.lorcana.characterStates[cardId];
    expect(charState.playedThisTurn).toBe(true);
    expect(charState.damage).toBe(0);
    expect(charState.exerted).toBe(false);
  });

  it("should track damage on characters", () => {
    const player1 = createPlayerId("player1");
    const cardId = "card-character-1";

    const state: LorcanaState = {
      players: [player1],
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "main",
      lorcana: {
        lore: { [player1]: 0 },
        ink: {
          available: { [player1]: 0 },
          total: { [player1]: 0 },
        },
        turnMetadata: {
          cardsPlayedThisTurn: [],
          charactersQuesting: [],
          inkedThisTurn: false,
        },
        characterStates: {
          [cardId]: {
            playedThisTurn: false,
            damage: 3, // Has 3 damage counters (Rule 9)
            exerted: true,
          },
        },
        permanentStates: {},
      },
    };

    expect(state.lorcana.characterStates[cardId].damage).toBe(3);
  });

  it("should track turn metadata including cards played and characters questing", () => {
    const player1 = createPlayerId("player1");
    const card1 = "card-1";
    const card2 = "card-2";

    const state: LorcanaState = {
      players: [player1],
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "main",
      lorcana: {
        lore: { [player1]: 0 },
        ink: {
          available: { [player1]: 0 },
          total: { [player1]: 0 },
        },
        turnMetadata: {
          cardsPlayedThisTurn: [card1],
          charactersQuesting: [card2],
          inkedThisTurn: true, // Already inked this turn (Rule 4.3.3)
        },
        characterStates: {},
        permanentStates: {},
      },
    };

    expect(state.lorcana.turnMetadata.cardsPlayedThisTurn).toContain(card1);
    expect(state.lorcana.turnMetadata.charactersQuesting).toContain(card2);
    expect(state.lorcana.turnMetadata.inkedThisTurn).toBe(true);
  });

  it("should optionally track challenge state during challenges", () => {
    const player1 = createPlayerId("player1");
    const attacker = "card-attacker";
    const defender = "card-defender";

    const state: LorcanaState = {
      players: [player1],
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "main",
      lorcana: {
        lore: { [player1]: 0 },
        ink: {
          available: { [player1]: 0 },
          total: { [player1]: 0 },
        },
        turnMetadata: {
          cardsPlayedThisTurn: [],
          charactersQuesting: [],
          inkedThisTurn: false,
        },
        characterStates: {},
        permanentStates: {},
        challengeState: {
          attacker,
          defender,
          attackerDamage: 5,
          defenderDamage: 3,
        },
      },
    };

    expect(state.lorcana.challengeState).toBeDefined();
    expect(state.lorcana.challengeState?.attacker).toBe(attacker);
    expect(state.lorcana.challengeState?.defender).toBe(defender);
    expect(state.lorcana.challengeState?.attackerDamage).toBe(5);
  });

  it("should track location and item states separately from characters", () => {
    const player1 = createPlayerId("player1");
    const locationId = "card-location-1";

    const state: LorcanaState = {
      players: [player1],
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "main",
      lorcana: {
        lore: { [player1]: 0 },
        ink: {
          available: { [player1]: 0 },
          total: { [player1]: 0 },
        },
        turnMetadata: {
          cardsPlayedThisTurn: [],
          charactersQuesting: [],
          inkedThisTurn: false,
        },
        characterStates: {},
        permanentStates: {
          [locationId]: {
            damage: 2, // Locations can take damage
          },
        },
      },
    };

    expect(state.lorcana.permanentStates[locationId].damage).toBe(2);
  });

  it("should have required base game properties", () => {
    const player1 = createPlayerId("player1");
    const player2 = createPlayerId("player2");

    const state: LorcanaState = {
      players: [player1, player2],
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "beginning",
      lorcana: {
        lore: { [player1]: 0, [player2]: 0 },
        ink: {
          available: { [player1]: 0, [player2]: 0 },
          total: { [player1]: 0, [player2]: 0 },
        },
        turnMetadata: {
          cardsPlayedThisTurn: [],
          charactersQuesting: [],
          inkedThisTurn: false,
        },
        characterStates: {},
        permanentStates: {},
      },
    };

    // Verify base game properties exist
    expect(state.players).toEqual([player1, player2]);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.turnNumber).toBe(1);
    expect(state.phase).toBe("beginning");
  });
});
