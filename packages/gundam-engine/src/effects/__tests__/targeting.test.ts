/**
 * Gundam Targeting System Tests
 *
 * Tests for target resolution, validation, and filtering.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "@tcg/core";
import { createTestState, type TestZoneData } from "../../testing/test-helpers";
import type { GundamGameState } from "../../types";
import {
  eachFriendlyUnitTarget,
  eachOpponentUnitTarget,
  eachUnitTarget,
  filterTargets,
  filterTargetsByPosition,
  getAllUnits,
  getBase,
  getCardsInDeck,
  getCardsInHand,
  getCardsInTrash,
  getCardsInZone,
  getResources,
  getShields,
  getUnitsInBattleArea,
  isValidTarget,
  isValidTargetId,
  limitTargets,
  resolveTarget,
} from "../targeting";

// ============================================================================
// TEST FIXTURES
// ============================================================================

const PLAYER_1: PlayerId = "player-1" as PlayerId;
const PLAYER_2: PlayerId = "player-2" as PlayerId;
const CARD_1: CardId = "card-1" as CardId;
const CARD_2: CardId = "card-2" as CardId;
const CARD_3: CardId = "card-3" as CardId;

// Helper to get zone cards
function getZoneCards(
  state: GundamGameState,
  zoneName: string,
  player: PlayerId,
): CardId[] {
  const zoneKey = `${zoneName}-${player}`;
  const zone = state.internal.zones[zoneKey] as TestZoneData | undefined;
  return zone?.cardIds ?? [];
}

// ============================================================================
// TARGET RESOLUTION TESTS
// ============================================================================

describe("Target Resolution", () => {
  let mockState: GundamGameState;
  let card1: CardId;
  let card2: CardId;

  beforeEach(() => {
    card1 = CARD_1;
    card2 = CARD_2;

    mockState = createTestState({
      players: [PLAYER_1, PLAYER_2],
      activePlayerId: PLAYER_1,
      battleAreaCards: { [PLAYER_1]: [card2], [PLAYER_2]: [] },
      cardPositions: { [card1]: "active", [card2]: "rested" },
    });
  });

  describe("String Target Resolution", () => {
    it("should resolve 'this' target", () => {
      const result = resolveTarget("this", mockState, PLAYER_1, card1);
      expect(result.cardIds).toEqual([card1]);
      expect(result.players).toHaveLength(0);
    });

    it("should resolve 'self' target", () => {
      const result = resolveTarget("self", mockState, PLAYER_1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toEqual([PLAYER_1]);
    });

    it("should resolve 'opponent' target", () => {
      const result = resolveTarget("opponent", mockState, PLAYER_1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toEqual([PLAYER_2]);
    });

    it("should resolve 'each-player' target", () => {
      const result = resolveTarget("each-player", mockState, PLAYER_1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toEqual([PLAYER_1, PLAYER_2]);
    });

    it("should resolve 'each-unit' target", () => {
      const result = resolveTarget("each-unit", mockState, PLAYER_1);
      expect(result.cardIds).toEqual([card2]);
      expect(result.players).toHaveLength(0);
    });

    it("should resolve 'each-friendly-unit' target", () => {
      const result = resolveTarget("each-friendly-unit", mockState, PLAYER_1);
      expect(result.cardIds).toEqual([card2]);
      expect(result.players).toHaveLength(0);
    });

    it("should resolve 'each-opponent-unit' target", () => {
      const result = resolveTarget("each-opponent-unit", mockState, PLAYER_1);
      expect(result.cardIds).toHaveLength(0);
      expect(result.players).toHaveLength(0);
    });
  });
});

// ============================================================================
// TARGET VALIDATION TESTS
// ============================================================================

describe("Target Validation", () => {
  let mockState: GundamGameState;
  let card1: CardId;
  let card2: CardId;

  beforeEach(() => {
    card1 = CARD_1;
    card2 = CARD_2;

    mockState = createTestState({
      players: [PLAYER_1, PLAYER_2],
      activePlayerId: PLAYER_1,
      handCards: { [PLAYER_1]: [card1], [PLAYER_2]: [] },
      battleAreaCards: { [PLAYER_1]: [card2], [PLAYER_2]: [] },
      cardPositions: { [card1]: "active", [card2]: "rested" },
    });
  });

  it("should validate valid target", () => {
    expect(isValidTarget("each-unit", mockState, PLAYER_1)).toBe(true);
  });

  it("should validate specific card target", () => {
    expect(isValidTargetId(card2, "each-unit", mockState, PLAYER_1)).toBe(true);
  });
});

// ============================================================================
// ZONE QUERY TESTS
// ============================================================================

describe("Zone Query Functions", () => {
  let mockState: GundamGameState;
  let card1: CardId;
  let card2: CardId;

  beforeEach(() => {
    card1 = CARD_1;
    card2 = CARD_2;

    mockState = createTestState({
      players: [PLAYER_1, PLAYER_2],
      activePlayerId: PLAYER_1,
      handCards: { [PLAYER_1]: [card1], [PLAYER_2]: [] },
      battleAreaCards: { [PLAYER_1]: [card2], [PLAYER_2]: [] },
    });
  });

  it("should get all units", () => {
    const result = getAllUnits(mockState);
    expect(result.cardIds).toContain(card2);
  });

  it("should get units in battle area for player", () => {
    const result = getUnitsInBattleArea(mockState, PLAYER_1);
    expect(result.cardIds).toEqual([card2]);
  });

  it("should get cards in hand", () => {
    const result = getCardsInHand(mockState, PLAYER_1);
    expect(result.cardIds).toEqual([card1]);
  });

  it("should get cards in deck", () => {
    const result = getCardsInDeck(mockState, PLAYER_1);
    expect(Array.isArray(result.cardIds)).toBe(true);
  });

  it("should get cards in trash", () => {
    const result = getCardsInTrash(mockState, PLAYER_1);
    expect(Array.isArray(result.cardIds)).toBe(true);
  });

  it("should get shields", () => {
    const result = getShields(mockState, PLAYER_1);
    expect(Array.isArray(result.cardIds)).toBe(true);
  });

  it("should get base", () => {
    const result = getBase(mockState, PLAYER_1);
    expect(Array.isArray(result.cardIds)).toBe(true);
  });

  it("should get resources", () => {
    const result = getResources(mockState, PLAYER_1);
    expect(Array.isArray(result.cardIds)).toBe(true);
  });

  it("should get cards in specific zone", () => {
    const result = getCardsInZone(mockState, PLAYER_1, "battleArea");
    expect(result.cardIds).toEqual([card2]);
  });
});

// ============================================================================
// TARGET FILTERING TESTS
// ============================================================================

describe("Target Filtering", () => {
  let mockState: GundamGameState;
  let card1: CardId;
  let card2: CardId;

  beforeEach(() => {
    card1 = CARD_1;
    card2 = CARD_2;

    mockState = createTestState({
      players: [PLAYER_1, PLAYER_2],
      activePlayerId: PLAYER_1,
      battleAreaCards: { [PLAYER_1]: [card1, card2], [PLAYER_2]: [] },
      cardPositions: { [card1]: "active", [card2]: "rested" },
    });
  });

  it("should filter targets by predicate", () => {
    const targets = getUnitsInBattleArea(mockState, PLAYER_1);
    const filtered = filterTargets(targets, (id) => id === card1);
    expect(filtered.cardIds).toEqual([card1]);
  });

  it("should filter targets by position (rested)", () => {
    const targets = getUnitsInBattleArea(mockState, PLAYER_1);
    const filtered = filterTargetsByPosition(mockState, targets, "rested");
    expect(filtered.cardIds).toEqual([card2]);
  });

  it("should filter targets by position (active)", () => {
    const targets = getUnitsInBattleArea(mockState, PLAYER_1);
    const filtered = filterTargetsByPosition(mockState, targets, "active");
    expect(filtered.cardIds).toEqual([card1]);
  });

  it("should limit number of targets", () => {
    const targets = getUnitsInBattleArea(mockState, PLAYER_1);
    const limited = limitTargets(targets, 1);
    expect(limited.cardIds).toHaveLength(1);
  });
});

// ============================================================================
// TARGET BUILDER TESTS
// ============================================================================

describe("Target Builders", () => {
  it("should create each unit target", () => {
    expect(eachUnitTarget()).toBe("each-unit");
  });

  it("should create each friendly unit target", () => {
    expect(eachFriendlyUnitTarget()).toBe("each-friendly-unit");
  });

  it("should create each opponent unit target", () => {
    expect(eachOpponentUnitTarget()).toBe("each-opponent-unit");
  });
});
