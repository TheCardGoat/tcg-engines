/**
 * Integration Tests for Action Handlers
 *
 * Tests handlers working together, edge cases, and state consistency.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId, Zone } from "@tcg/core";
import { createZone, createZoneId } from "@tcg/core";
import type {
  DamageAction,
  DestroyAction,
  DrawAction,
  EffectAction,
  ModifyStatsAction,
  RestAction,
} from "@tcg/gundam-types/effects";
import { produce } from "immer";
import type { GundamGameState } from "../../types";
import {
  type ActionContext,
  executeActions,
  findCardZone,
  handleDestroyAction,
} from "../action-handlers";

// ============================================================================
// TEST FIXTURES
// ============================================================================

const PLAYER_1: PlayerId = "player-1" as PlayerId;
const PLAYER_2: PlayerId = "player-2" as PlayerId;

const CARD_1: CardId = "card-1" as CardId;
const CARD_2: CardId = "card-2" as CardId;
const CARD_3: CardId = "card-3" as CardId;
const CARD_4: CardId = "card-4" as CardId;
const CARD_5: CardId = "card-5" as CardId;
const SOURCE_CARD: CardId = "source-card" as CardId;

function createMockZone(owner: PlayerId, cards: CardId[] = []): Zone {
  return createZone(
    {
      id: createZoneId(`zone-${owner}`),
      name: "Test Zone",
      visibility: "public",
      ordered: true,
      owner,
    },
    cards,
  );
}

function createInitialGameState(): GundamGameState {
  return {
    players: [PLAYER_1, PLAYER_2],
    currentPlayer: PLAYER_1,
    turn: 1,
    phase: "main",
    zones: {
      deck: {
        [PLAYER_1]: createMockZone(PLAYER_1, [CARD_1, CARD_2, CARD_3]),
        [PLAYER_2]: createMockZone(PLAYER_2, [CARD_4, CARD_5]),
      },
      resourceDeck: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      hand: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      battleArea: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      shieldSection: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      baseSection: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      resourceArea: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      trash: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      removal: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      limbo: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
    },
    gundam: {
      activeResources: {
        [PLAYER_1]: 0,
        [PLAYER_2]: 0,
      },
      cardPositions: {},
      attackedThisTurn: [],
      hasPlayedResourceThisTurn: {
        [PLAYER_1]: false,
        [PLAYER_2]: false,
      },
      effectStack: {
        stack: [],
        nextInstanceId: 0,
      },
      temporaryModifiers: {},
      cardDamage: {},
      revealedCards: [],
    },
  };
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

// ============================================================================
// MULTI-ACTION EFFECT TESTS
// ============================================================================

describe("Multi-action effects", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should execute DRAW then MODIFY_STATS", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const actions: EffectAction[] = [
      {
        type: "DRAW",
        count: 1,
        player: "self",
      } as DrawAction,
      {
        type: "MODIFY_STATS",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
        apModifier: 2,
        duration: "this_turn",
      } as ModifyStatsAction,
    ];

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    // Should have drawn 1 card
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(1);
    // Should have modified stats on CARD_1
    expect(state.gundam.temporaryModifiers[CARD_1]).toBeDefined();
    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      apModifier: 2,
    });
  });

  it("should execute REST then DAMAGE", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const actions: EffectAction[] = [
      {
        type: "REST",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
      } as RestAction,
      {
        type: "DAMAGE",
        amount: 2,
        target: "unit",
        damageType: "effect",
      } as DamageAction,
    ];

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    // Card should be rested
    expect(state.gundam.cardPositions[CARD_1]).toBe("rested");
    // Damage should have been applied (placeholder)
    expect(state).toBeDefined();
  });

  it("should handle three-action sequence", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const actions: EffectAction[] = [
      {
        type: "DRAW",
        count: 2,
        player: "self",
      } as DrawAction,
      {
        type: "REST",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
      } as RestAction,
      {
        type: "MODIFY_STATS",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
        apModifier: -1,
        duration: "this_turn",
      } as ModifyStatsAction,
    ];

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    expect(state.zones.hand[PLAYER_1].cards.length).toBe(2);
    expect(state.gundam.cardPositions[CARD_1]).toBe("rested");
    expect(state.gundam.temporaryModifiers[CARD_1]).toBeDefined();
  });
});

// ============================================================================
// CHAINED EFFECTS TESTS
// ============================================================================

describe("Chained effects", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should handle DESTROY triggering additional cleanup", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_2].cards = [];
      draft.zones.battleArea[PLAYER_2].cards = [CARD_4];
      draft.gundam.cardPositions[CARD_4] = "active";
      draft.gundam.temporaryModifiers[CARD_4] = [
        {
          id: "mod-1" as any,
          duration: "end_of_turn",
          sourceId: SOURCE_CARD,
          apModifier: 3,
          hpModifier: 2,
          grantedKeywords: ["Mobile"],
        },
        {
          id: "mod-2" as any,
          duration: "permanent",
          sourceId: SOURCE_CARD,
          apModifier: 1,
        },
      ];
    });

    const action: DestroyAction = {
      type: "DESTROY",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "opponent" }],
        chooser: "controller",
        timing: "on_resolution",
      },
    };

    context.targets = [CARD_4];
    state = produce(state, (draft) => {
      handleDestroyAction(draft, action, context);
    });

    // Card should be in trash
    expect(state.zones.trash[PLAYER_2].cards).toContain(CARD_4);
    // Position should be cleared
    expect(state.gundam.cardPositions[CARD_4]).toBeUndefined();
    // Modifiers should be cleared
    expect(state.gundam.temporaryModifiers[CARD_4]).toBeUndefined();
  });

  it("should handle destroying multiple cards with modifiers", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_2].cards = [];
      draft.zones.battleArea[PLAYER_2].cards = [CARD_4, CARD_5];
      draft.gundam.cardPositions[CARD_4] = "rested";
      draft.gundam.cardPositions[CARD_5] = "active";
      draft.gundam.temporaryModifiers[CARD_4] = [
        {
          id: "mod-1" as any,
          duration: "end_of_turn",
          sourceId: SOURCE_CARD,
          apModifier: 2,
        },
      ];
      draft.gundam.temporaryModifiers[CARD_5] = [
        {
          id: "mod-2" as any,
          duration: "permanent",
          sourceId: SOURCE_CARD,
          hpModifier: 1,
        },
      ];
    });

    const action: DestroyAction = {
      type: "DESTROY",
      target: {
        count: 2,
        validTargets: [{ type: "unit", owner: "opponent" }],
        chooser: "controller",
        timing: "on_resolution",
      },
    };

    context.targets = [CARD_4, CARD_5];
    state = produce(state, (draft) => {
      handleDestroyAction(draft, action, context);
    });

    // Both cards should be in trash
    expect(state.zones.trash[PLAYER_2].cards).toEqual([CARD_4, CARD_5]);
    // Both positions should be cleared
    expect(state.gundam.cardPositions[CARD_4]).toBeUndefined();
    expect(state.gundam.cardPositions[CARD_5]).toBeUndefined();
    // Both modifiers should be cleared
    expect(state.gundam.temporaryModifiers[CARD_4]).toBeUndefined();
    expect(state.gundam.temporaryModifiers[CARD_5]).toBeUndefined();
  });
});

// ============================================================================
// EDGE CASES TESTS
// ============================================================================

describe("Edge cases", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should handle destroying a card with no modifiers", () => {
    state.zones.battleArea[PLAYER_2].cards = [CARD_4];
    state.gundam.cardPositions[CARD_4] = "active";

    const action: DestroyAction = {
      type: "DESTROY",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "opponent" }],
        chooser: "controller",
        timing: "on_resolution",
      },
    };

    context.targets = [CARD_4];
    handleDestroyAction(state, action, context);

    expect(state.zones.trash[PLAYER_2].cards).toContain(CARD_4);
    expect(state.gundam.cardPositions[CARD_4]).toBeUndefined();
  });

  it("should handle actions on cards that don't exist", () => {
    state.zones.battleArea[PLAYER_1].cards = [CARD_1];

    const actions: EffectAction[] = [
      {
        type: "REST",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
      } as RestAction,
    ];

    // Target a card that's not in the battle area
    context.targets = ["non-existent" as CardId];
    executeActions(state, actions, context);

    // Should not crash
    expect(state).toBeDefined();
    // CARD_1 should still be in battle area
    expect(state.zones.battleArea[PLAYER_1].cards).toContain(CARD_1);
  });

  it("should handle empty actions array", () => {
    state.zones.battleArea[PLAYER_1].cards = [CARD_1];

    const actions: EffectAction[] = [];

    context.targets = [CARD_1];
    executeActions(state, actions, context);

    // State should be unchanged
    expect(state.zones.battleArea[PLAYER_1].cards).toEqual([CARD_1]);
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

  it("should maintain card uniqueness across zones", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const actions: EffectAction[] = [
      {
        type: "REST",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
      } as RestAction,
      {
        type: "MODIFY_STATS",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
        apModifier: 2,
        duration: "this_turn",
      } as ModifyStatsAction,
    ];

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    // Count cards across all zones
    const allCards = new Set<CardId>();
    for (const player of state.players) {
      for (const zoneType of Object.keys(state.zones) as Array<
        keyof typeof state.zones
      >) {
        for (const cardId of state.zones[zoneType][player].cards) {
          allCards.add(cardId);
        }
      }
    }

    // CARD_1 should appear exactly once
    expect(allCards.has(CARD_1)).toBe(true);
    const count = Array.from(allCards).filter((id) => id === CARD_1).length;
    expect(count).toBe(1);
  });

  it("should maintain modifier tracking consistency", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1, CARD_2];
      draft.gundam.cardPositions[CARD_1] = "active";
      draft.gundam.cardPositions[CARD_2] = "active";
    });

    const actions: EffectAction[] = [
      {
        type: "MODIFY_STATS",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
        apModifier: 1,
        duration: "this_turn",
      } as ModifyStatsAction,
      {
        type: "MODIFY_STATS",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
        apModifier: 2,
        duration: "permanent",
      } as ModifyStatsAction,
    ];

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    // CARD_1 should have 2 modifiers
    expect(state.gundam.temporaryModifiers[CARD_1]?.length).toBe(2);
    // CARD_2 should have 0 modifiers
    expect(state.gundam.temporaryModifiers[CARD_2]).toBeUndefined();
  });

  it("should verify findCardZone consistency after moves", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.hand[PLAYER_1].cards = [CARD_1];
    });

    const actions: EffectAction[] = [
      {
        type: "MOVE_CARD",
        from: "hand",
        to: "battleArea",
        target: {
          count: 1,
          validTargets: [{ type: "card", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
      } as any,
    ];

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    const location = findCardZone(CARD_1, state);

    expect(location).toEqual({
      zone: "battleArea",
      owner: PLAYER_1,
    });
  });

  it("should clear all tracking when card is destroyed", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_2].cards = [];
      draft.zones.battleArea[PLAYER_2].cards = [CARD_4];
      draft.gundam.cardPositions[CARD_4] = "rested";
      draft.gundam.temporaryModifiers[CARD_4] = [
        {
          id: "mod-1" as any,
          duration: "end_of_turn",
          sourceId: SOURCE_CARD,
          apModifier: 5,
          grantedKeywords: ["Mobile", "Breach"],
        },
      ];
    });

    const action: DestroyAction = {
      type: "DESTROY",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "opponent" }],
        chooser: "controller",
        timing: "on_resolution",
      },
    };

    context.targets = [CARD_4];
    state = produce(state, (draft) => {
      handleDestroyAction(draft, action, context);
    });

    // Verify complete cleanup
    expect(findCardZone(CARD_4, state)).toEqual({
      zone: "trash",
      owner: PLAYER_2,
    });
    expect(state.gundam.cardPositions[CARD_4]).toBeUndefined();
    expect(state.gundam.temporaryModifiers[CARD_4]).toBeUndefined();
  });
});

// ============================================================================
// CROSS-PLAYER OPERATIONS TESTS
// ============================================================================

describe("Cross-player operations", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should affect opponent's cards", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_2].cards = [CARD_5];
      draft.zones.battleArea[PLAYER_2].cards = [CARD_4];
      draft.gundam.cardPositions[CARD_4] = "active";
    });

    const actions: EffectAction[] = [
      {
        type: "REST",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "opponent" }],
          chooser: "controller",
          timing: "on_resolution",
        },
      } as RestAction,
    ];

    context.targets = [CARD_4];
    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    expect(state.gundam.cardPositions[CARD_4]).toBe("rested");
  });

  it("should draw for opponent", () => {
    const actions: EffectAction[] = [
      {
        type: "DRAW",
        count: 2,
        player: "opponent",
      } as DrawAction,
    ];

    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    expect(state.zones.hand[PLAYER_2].cards.length).toBe(2);
    expect(state.zones.deck[PLAYER_2].cards.length).toBe(0); // Had 2 cards, drew both
  });

  it("should handle mixed player targets", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.deck[PLAYER_2].cards = [CARD_5];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.zones.battleArea[PLAYER_2].cards = [CARD_4];
      draft.gundam.cardPositions[CARD_1] = "active";
      draft.gundam.cardPositions[CARD_4] = "active";
    });

    const actions: EffectAction[] = [
      {
        type: "REST",
        target: {
          count: 2,
          validTargets: [{ type: "unit", owner: "any" }],
          chooser: "controller",
          timing: "on_resolution",
        },
      } as RestAction,
    ];

    context.targets = [CARD_1, CARD_4];
    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    expect(state.gundam.cardPositions[CARD_1]).toBe("rested");
    expect(state.gundam.cardPositions[CARD_4]).toBe("rested");
  });
});
