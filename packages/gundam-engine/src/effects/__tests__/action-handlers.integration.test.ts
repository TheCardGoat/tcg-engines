/**
 * Integration Tests for Action Handlers
 *
 * Tests handlers working together, edge cases, and state consistency.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId } from "@tcg/core";
import type {
  DrawAction,
  RestAction,
  TargetingSpec,
} from "@tcg/gundam-types/effects";
import { produce } from "immer";
import { createTestState, type TestZoneData } from "../../testing/test-helpers";
import type { GundamGameState } from "../../types";
import {
  type ActionContext,
  executeActions,
  findCardZone,
} from "../action-handlers";

// ============================================================================
// TEST FIXTURES
// ============================================================================

const PLAYER_1: PlayerId = "player-1" as PlayerId;
const PLAYER_2: PlayerId = "player-2" as PlayerId;

const CARD_1: CardId = "card-1" as CardId;
const CARD_2: CardId = "card-2" as CardId;
const SOURCE_CARD: CardId = "source-card" as CardId;

function createInitialGameState(): GundamGameState {
  return createTestState({
    players: [PLAYER_1, PLAYER_2],
    activePlayerId: PLAYER_1,
    turnNumber: 1,
    currentPhase: "main",
    activeResources: { [PLAYER_1]: 0, [PLAYER_2]: 0 },
  });
}

function createMockContext(
  controllerId: PlayerId = PLAYER_1,
  targets?: CardId[],
): ActionContext {
  return {
    sourceCardId: SOURCE_CARD,
    controllerId,
    targets,
  };
}

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

// Helper to set zone cards
function setZoneCards(
  draft: import("immer").Draft<GundamGameState>,
  zoneName: string,
  player: PlayerId,
  cards: CardId[],
): void {
  const zoneKey = `${zoneName}-${player}`;
  const zone = draft.internal.zones[zoneKey] as TestZoneData;
  if (zone) {
    zone.cardIds = cards;
  }
}

// ============================================================================
// DRAW ACTION TESTS
// ============================================================================

describe("Draw Actions", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createTestState({
      players: [PLAYER_1, PLAYER_2],
      activePlayerId: PLAYER_1,
      turnNumber: 1,
      currentPhase: "main",
      deckCards: { [PLAYER_1]: [CARD_1, CARD_2], [PLAYER_2]: [CARD_1, CARD_2] },
      handCards: { [PLAYER_1]: [], [PLAYER_2]: [] },
    });
    context = createMockContext();
  });

  it("should draw for self player", () => {
    const action: DrawAction = {
      type: "DRAW",
      count: 1,
      player: "self",
    };

    context = createMockContext(PLAYER_1);

    const newState = produce(state, (draft) => {
      executeActions(draft, [action], context);
    });

    expect(getZoneCards(newState, "hand", PLAYER_1)).toHaveLength(1);
    expect(getZoneCards(newState, "hand", PLAYER_2)).toHaveLength(0);
  });

  it("should draw for opponent when specified", () => {
    const action: DrawAction = {
      type: "DRAW",
      count: 1,
      player: "opponent",
    };

    context = createMockContext(PLAYER_1);

    const newState = produce(state, (draft) => {
      executeActions(draft, [action], context);
    });

    expect(getZoneCards(newState, "hand", PLAYER_1)).toHaveLength(0);
    expect(getZoneCards(newState, "hand", PLAYER_2)).toHaveLength(1);
  });
});

// ============================================================================
// STATE CONSISTENCY TESTS
// ============================================================================

describe("State consistency", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should maintain card count across zones", () => {
    const CARD_3: CardId = "card-3" as CardId;
    state = createTestState({
      players: [PLAYER_1, PLAYER_2],
      handCards: { [PLAYER_1]: [CARD_1, CARD_2], [PLAYER_2]: [] },
      deckCards: { [PLAYER_1]: [CARD_3], [PLAYER_2]: [] },
    });

    const action: DrawAction = {
      type: "DRAW",
      count: 1,
      player: "self",
    };

    const handBefore = getZoneCards(state, "hand", PLAYER_1).length;
    const deckBefore = getZoneCards(state, "deck", PLAYER_1).length;

    const newState = produce(state, (draft) => {
      executeActions(draft, [action], context);
    });

    const handAfter = getZoneCards(newState, "hand", PLAYER_1).length;
    const deckAfter = getZoneCards(newState, "deck", PLAYER_1).length;

    expect(handAfter).toBe(handBefore + 1);
    expect(deckAfter).toBe(deckBefore - 1);
  });
});

// ============================================================================
// TARGET RESOLUTION TESTS
// ============================================================================

describe("Target resolution", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should find card in correct zone", () => {
    state = createTestState({
      players: [PLAYER_1, PLAYER_2],
      battleAreaCards: { [PLAYER_1]: [CARD_1], [PLAYER_2]: [] },
    });

    const zoneInfo = findCardZone(CARD_1, state);
    expect(zoneInfo).toBeDefined();
    expect(zoneInfo?.zone).toBe("battleArea");
    expect(zoneInfo?.owner).toBe(PLAYER_1);
  });

  it("should return undefined for card not in any zone", () => {
    const zoneInfo = findCardZone("nonexistent" as CardId, state);
    expect(zoneInfo).toBeNull();
  });
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

describe("Edge cases", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should handle empty action list gracefully", () => {
    expect(() => {
      produce(state, (draft) => {
        executeActions(draft, [], context);
      });
    }).not.toThrow();
  });
});
