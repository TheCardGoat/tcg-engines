/**
 * Unit Tests for Action Handlers
 *
 * Comprehensive tests for all effect action handlers.
 * Tests use Immer's produce to create draft states for testing.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId, Zone } from "@tcg/core";
import { createZone, createZoneId } from "@tcg/core";
import { produce } from "immer";
import type { CardPosition, GundamGameState } from "../../types";
import type {
  ActivateAction,
  DamageAction,
  DestroyAction,
  DiscardAction,
  DrawAction,
  GrantKeywordAction,
  ModifyStatsAction,
  MoveCardAction,
  RestAction,
  SearchAction,
} from "../../types/effects";
import {
  type ActionContext,
  createModifierId,
  executeAction,
  executeActions,
  findCardZone,
  getOpponentPlayer,
  handleActivateAction,
  handleDamageAction,
  handleDestroyAction,
  handleDiscardAction,
  handleDrawAction,
  handleGrantKeywordAction,
  handleModifyStatsAction,
  handleMoveCardAction,
  handleRestAction,
  handleSearchAction,
  resetModifierCounter,
  resolvePlayerRef,
  resolveSimpleTarget,
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
      ordered: true,
      owner,
      visibility: "public",
    },
    cards,
  );
}

function createInitialGameState(): GundamGameState {
  return {
    currentPlayer: PLAYER_1,
    gundam: {
      activeResources: {
        [PLAYER_1]: 0,
        [PLAYER_2]: 0,
      },
      attackedThisTurn: [],
      cardDamage: {},
      cardPositions: {},
      effectStack: {
        nextInstanceId: 0,
        stack: [],
      },
      hasPlayedResourceThisTurn: {
        [PLAYER_1]: false,
        [PLAYER_2]: false,
      },
      revealedCards: [],
      temporaryModifiers: {},
    },
    phase: "main",
    players: [PLAYER_1, PLAYER_2],
    turn: 1,
    zones: {
      baseSection: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      battleArea: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      deck: {
        [PLAYER_1]: createMockZone(PLAYER_1, [CARD_1, CARD_2, CARD_3]),
        [PLAYER_2]: createMockZone(PLAYER_2, [CARD_4, CARD_5]),
      },
      hand: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      limbo: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      removal: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      resourceArea: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      resourceDeck: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      shieldSection: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
      trash: {
        [PLAYER_1]: createMockZone(PLAYER_1),
        [PLAYER_2]: createMockZone(PLAYER_2),
      },
    },
  };
}

function createMockContext(controllerId: PlayerId = PLAYER_1, targets?: CardId[]): ActionContext {
  return {
    controllerId,
    sourceCardId: SOURCE_CARD,
    targets,
  };
}

/**
 * Helper to execute a handler and return the updated state
 * Uses Immer's produce to properly mutate state
 */
function executeHandler<T extends EffectAction>(
  state: GundamGameState,
  handler: (draft: GundamGameState, action: T, context: ActionContext) => void,
  action: T,
  context: ActionContext,
): GundamGameState {
  return produce(state, (draft) => {
    handler(draft, action, context);
  });
}

// ============================================================================
// DRAW ACTION TESTS
// ============================================================================

describe("handleDrawAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should draw cards from deck to hand for self", () => {
    const action: DrawAction = {
      count: 2,
      player: "self",
      type: "DRAW",
    };

    state = produce(state, (draft) => {
      handleDrawAction(draft, action, context);
    });

    // Player 1 should have 2 cards in hand
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(2);
    expect(state.zones.hand[PLAYER_1].cards).toEqual([CARD_1, CARD_2]);

    // Player 1 deck should have 1 card remaining
    expect(state.zones.deck[PLAYER_1].cards.length).toBe(1);
    expect(state.zones.deck[PLAYER_1].cards).toEqual([CARD_3]);
  });

  it("should draw cards for opponent", () => {
    const action: DrawAction = {
      count: 1,
      player: "opponent",
      type: "DRAW",
    };

    state = executeHandler(state, handleDrawAction, action, context);

    // Player 2 should have 1 card in hand
    expect(state.zones.hand[PLAYER_2].cards.length).toBe(1);
    expect(state.zones.hand[PLAYER_2].cards).toEqual([CARD_4]);

    // Player 2 deck should have 1 card remaining
    expect(state.zones.deck[PLAYER_2].cards.length).toBe(1);
  });

  it("should handle empty deck gracefully", () => {
    // Empty the deck
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [];
    });

    const action: DrawAction = {
      count: 2,
      player: "self",
      type: "DRAW",
    };

    // The draw function will throw, so we expect an error
    expect(() => {
      executeHandler(state, handleDrawAction, action, context);
    }).toThrow();
  });

  it("should draw multiple cards", () => {
    // Add more cards to deck
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_1, CARD_2, CARD_3, CARD_4, CARD_5];
    });

    const action: DrawAction = {
      count: 3,
      player: "self",
      type: "DRAW",
    };

    state = executeHandler(state, handleDrawAction, action, context);

    expect(state.zones.hand[PLAYER_1].cards.length).toBe(3);
    expect(state.zones.deck[PLAYER_1].cards.length).toBe(2);
  });
});

// ============================================================================
// DAMAGE ACTION TESTS
// ============================================================================

describe("handleDamageAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should apply damage to a target unit", () => {
    const action: DamageAction = {
      amount: 2,
      damageType: "effect",
      target: "unit",
      type: "DAMAGE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);

    // Verify damage is tracked
    expect(state.gundam.cardDamage[CARD_1]).toBe(2);
  });

  it("should handle no targets gracefully", () => {
    const action: DamageAction = {
      amount: 3,
      damageType: "effect",
      target: "base",
      type: "DAMAGE",
    };

    // No targets provided
    state = executeHandler(state, handleDamageAction, action, context);

    // Should not throw or crash
    expect(state).toBeDefined();
    // No damage should be tracked
    expect(Object.keys(state.gundam.cardDamage)).toHaveLength(0);
  });

  it("should handle damage to base", () => {
    const action: DamageAction = {
      amount: 1,
      damageType: "effect",
      target: "base",
      type: "DAMAGE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);

    expect(state.gundam.cardDamage[CARD_1]).toBe(1);
  });

  it("should handle damage to shield", () => {
    const action: DamageAction = {
      amount: 1,
      damageType: "effect",
      target: "shield",
      type: "DAMAGE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);

    expect(state.gundam.cardDamage[CARD_1]).toBe(1);
  });

  it("should accumulate damage on same target", () => {
    const action: DamageAction = {
      amount: 2,
      damageType: "effect",
      target: "unit",
      type: "DAMAGE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);
    expect(state.gundam.cardDamage[CARD_1]).toBe(2);

    // Apply damage again
    state = executeHandler(state, handleDamageAction, action, context);
    expect(state.gundam.cardDamage[CARD_1]).toBe(4);
  });

  it("should handle damage to multiple targets", () => {
    const action: DamageAction = {
      amount: 3,
      damageType: "effect",
      target: "unit",
      type: "DAMAGE",
    };

    context.targets = [CARD_1, CARD_2];
    state = executeHandler(state, handleDamageAction, action, context);

    expect(state.gundam.cardDamage[CARD_1]).toBe(3);
    expect(state.gundam.cardDamage[CARD_2]).toBe(3);
  });

  it("should destroy shield and move to trash when damaged", () => {
    // Add a shield to shield section
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.shieldSection[PLAYER_1].cards = [CARD_1];
    });

    const action: DamageAction = {
      amount: 1,
      damageType: "effect",
      target: "shield",
      type: "DAMAGE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);

    // Shield should be moved to trash
    expect(state.zones.shieldSection[PLAYER_1].cards).toHaveLength(0);
    expect(state.zones.trash[PLAYER_1].cards).toContain(CARD_1);
    // Damage counter should be cleared
    expect(state.gundam.cardDamage[CARD_1]).toBeUndefined();
  });

  it("should destroy unit when damage >= HP", () => {
    // Register a card with HP 5
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    // Register card definition with HP 5
    const { registerCardDefinition } = require("../action-handlers");
    registerCardDefinition(CARD_1, {
      cardType: "UNIT",
      cost: 2,
      hp: 5,
      id: CARD_1,
      level: 3,
      name: "Test Unit",
    });

    const action: DamageAction = {
      amount: 5,
      damageType: "effect",
      target: "unit",
      type: "DAMAGE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);

    // Unit should be moved to trash
    expect(state.zones.battleArea[PLAYER_1].cards).toHaveLength(0);
    expect(state.zones.trash[PLAYER_1].cards).toContain(CARD_1);
    // Damage counter should be cleared
    expect(state.gundam.cardDamage[CARD_1]).toBeUndefined();
    // Position should be cleared
    expect(state.gundam.cardPositions[CARD_1]).toBeUndefined();

    // Clean up
    const { clearCardDefinitions } = require("../action-handlers");
    clearCardDefinitions();
  });

  it("should not destroy unit when damage < HP", () => {
    // Register a card with HP 5
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    // Register card definition with HP 5
    const { registerCardDefinition } = require("../action-handlers");
    registerCardDefinition(CARD_1, {
      cardType: "UNIT",
      cost: 2,
      hp: 5,
      id: CARD_1,
      level: 3,
      name: "Test Unit",
    });

    const action: DamageAction = {
      amount: 3,
      damageType: "effect",
      target: "unit",
      type: "DAMAGE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);

    // Unit should remain in battle area
    expect(state.zones.battleArea[PLAYER_1].cards).toContain(CARD_1);
    expect(state.zones.trash[PLAYER_1].cards).not.toContain(CARD_1);
    // Damage counter should be tracked
    expect(state.gundam.cardDamage[CARD_1]).toBe(3);

    // Clean up
    const { clearCardDefinitions } = require("../action-handlers");
    clearCardDefinitions();
  });

  it("should accumulate damage until lethal", () => {
    // Register a card with HP 5
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    // Register card definition with HP 5
    const { registerCardDefinition } = require("../action-handlers");
    registerCardDefinition(CARD_1, {
      cardType: "UNIT",
      cost: 2,
      hp: 5,
      id: CARD_1,
      level: 3,
      name: "Test Unit",
    });

    const action: DamageAction = {
      amount: 2,
      damageType: "effect",
      target: "unit",
      type: "DAMAGE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);
    expect(state.gundam.cardDamage[CARD_1]).toBe(2);
    expect(state.zones.battleArea[PLAYER_1].cards).toContain(CARD_1);

    // Apply damage again - now at 4
    state = executeHandler(state, handleDamageAction, action, context);
    expect(state.gundam.cardDamage[CARD_1]).toBe(4);
    expect(state.zones.battleArea[PLAYER_1].cards).toContain(CARD_1);

    // Apply 1 more damage - now at 5, lethal
    const finalAction: DamageAction = { ...action, amount: 1 };
    state = executeHandler(state, handleDamageAction, finalAction, context);
    expect(state.zones.battleArea[PLAYER_1].cards).toHaveLength(0);
    expect(state.zones.trash[PLAYER_1].cards).toContain(CARD_1);
    expect(state.gundam.cardDamage[CARD_1]).toBeUndefined();

    // Clean up
    const { clearCardDefinitions } = require("../action-handlers");
    clearCardDefinitions();
  });
});

// ============================================================================
// REST ACTION TESTS
// ============================================================================

describe("handleRestAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should rest a card in battle area", () => {
    // Add card to battle area
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const action: RestAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "REST",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleRestAction, action, context);

    expect(state.gundam.cardPositions[CARD_1]).toBe("rested");
  });

  it("should rest a card in resource area", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.resourceArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const action: RestAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "card", zone: "resourceArea" }],
      },
      type: "REST",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleRestAction, action, context);

    expect(state.gundam.cardPositions[CARD_1]).toBe("rested");
  });

  it("should no-op when card is already rested", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "rested";
    });

    const action: RestAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "REST",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleRestAction, action, context);

    expect(state.gundam.cardPositions[CARD_1]).toBe("rested");
  });

  it("should handle cards not in position-supporting zones", () => {
    // Card in hand (not position-supporting)
    state = produce(state, (draft) => {
      draft.zones.hand[PLAYER_1].cards = [CARD_1];
    });

    const action: RestAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "card" }],
      },
      type: "REST",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleRestAction, action, context);

    // Position should not be set for cards in non-position zones
    expect(state.gundam.cardPositions[CARD_1]).toBeUndefined();
  });
});

// ============================================================================
// ACTIVATE ACTION TESTS
// ============================================================================

describe("handleActivateAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should activate a rested card", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "rested";
    });

    const action: ActivateAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "ACTIVATE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleActivateAction, action, context);

    expect(state.gundam.cardPositions[CARD_1]).toBe("active");
  });

  it("should no-op when card is already active", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const action: ActivateAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "ACTIVATE",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleActivateAction, action, context);

    expect(state.gundam.cardPositions[CARD_1]).toBe("active");
  });
});

// ============================================================================
// MOVE CARD ACTION TESTS
// ============================================================================

describe("handleMoveCardAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should move card from hand to battle area", () => {
    state = produce(state, (draft) => {
      draft.zones.hand[PLAYER_1].cards = [CARD_1];
    });

    const action: MoveCardAction = {
      from: "hand",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "card" }],
      },
      to: "battleArea",
      type: "MOVE_CARD",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleMoveCardAction, action, context);

    expect(state.zones.hand[PLAYER_1].cards).toHaveLength(0);
    expect(state.zones.battleArea[PLAYER_1].cards).toEqual([CARD_1]);
  });

  it("should move card from battle area to trash", () => {
    state = produce(state, (draft) => {
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const action: MoveCardAction = {
      from: "battleArea",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "card" }],
      },
      to: "trash",
      type: "MOVE_CARD",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleMoveCardAction, action, context);

    expect(state.zones.battleArea[PLAYER_1].cards).toHaveLength(0);
    expect(state.zones.trash[PLAYER_1].cards).toEqual([CARD_1]);
    // Position should be cleared
    expect(state.gundam.cardPositions[CARD_1]).toBeUndefined();
  });

  it("should handle card not in source zone", () => {
    // Card is in deck, not hand
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [CARD_1];
    });

    const action: MoveCardAction = {
      from: "hand",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "card" }],
      },
      to: "battleArea",
      type: "MOVE_CARD",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleMoveCardAction, action, context);

    // Should not move the card (not in source zone)
    expect(state.zones.hand[PLAYER_1].cards).toHaveLength(0);
    expect(state.zones.battleArea[PLAYER_1].cards).toHaveLength(0);
  });

  it("should respect owner parameter", () => {
    state = produce(state, (draft) => {
      draft.zones.hand[PLAYER_2].cards = [CARD_4];
    });

    const action: MoveCardAction = {
      from: "hand",
      owner: "opponent",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "opponent", type: "card" }],
      },
      to: "battleArea",
      type: "MOVE_CARD",
    };

    context.targets = [CARD_4];
    state = executeHandler(state, handleMoveCardAction, action, context);

    // Should move opponent's card
    expect(state.zones.hand[PLAYER_2].cards).toHaveLength(0);
    expect(state.zones.battleArea[PLAYER_2].cards).toEqual([CARD_4]);
  });
});

// ============================================================================
// DESTROY ACTION TESTS
// ============================================================================

describe("handleDestroyAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should destroy unit in battle area", () => {
    state = produce(state, (draft) => {
      // Remove CARD_4 from deck and add to battle area
      draft.zones.deck[PLAYER_2].cards = [CARD_5];
      draft.zones.battleArea[PLAYER_2].cards = [CARD_4];
      draft.gundam.cardPositions[CARD_4] = "rested";
      draft.gundam.temporaryModifiers[CARD_4] = [
        {
          apModifier: 2,
          duration: "end_of_turn",
          id: "mod-1" as any,
          sourceId: SOURCE_CARD,
        },
      ];
    });

    const action: DestroyAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "opponent", type: "unit" }],
      },
      type: "DESTROY",
    };

    context.targets = [CARD_4];
    state = executeHandler(state, handleDestroyAction, action, context);

    expect(state.zones.battleArea[PLAYER_2].cards).toHaveLength(0);
    expect(state.zones.trash[PLAYER_2].cards).toEqual([CARD_4]);
    expect(state.gundam.cardPositions[CARD_4]).toBeUndefined();
    expect(state.gundam.temporaryModifiers[CARD_4]).toBeUndefined();
  });

  it("should handle destroy with no targets", () => {
    const action: DestroyAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "opponent", type: "unit" }],
      },
      type: "DESTROY",
    };

    // No targets
    state = executeHandler(state, handleDestroyAction, action, context);

    // Should not throw
    expect(state).toBeDefined();
  });

  it("should clear damage when destroying", () => {
    state = produce(state, (draft) => {
      draft.zones.battleArea[PLAYER_2].cards = [CARD_4];
    });

    const action: DestroyAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "opponent", type: "unit" }],
      },
      type: "DESTROY",
    };

    context.targets = [CARD_4];
    state = executeHandler(state, handleDestroyAction, action, context);

    // Damage clearing placeholder for T4
    expect(state.zones.trash[PLAYER_2].cards).toContain(CARD_4);
  });
});

// ============================================================================
// DISCARD ACTION TESTS
// ============================================================================

describe("handleDiscardAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should discard specified cards from hand", () => {
    state = produce(state, (draft) => {
      draft.zones.hand[PLAYER_1].cards = [CARD_1, CARD_2, CARD_3];
    });

    const action: DiscardAction = {
      count: 2,
      player: "self",
      type: "DISCARD",
    };

    context.targets = [CARD_1, CARD_2];
    state = executeHandler(state, handleDiscardAction, action, context);

    expect(state.zones.hand[PLAYER_1].cards).toEqual([CARD_3]);
    expect(state.zones.trash[PLAYER_1].cards).toContain(CARD_1);
    expect(state.zones.trash[PLAYER_1].cards).toContain(CARD_2);
  });

  it("should discard from opponent's hand", () => {
    state = produce(state, (draft) => {
      draft.zones.hand[PLAYER_2].cards = [CARD_4, CARD_5];
    });

    const action: DiscardAction = {
      count: 1,
      player: "opponent",
      type: "DISCARD",
    };

    context.targets = [CARD_4];
    state = executeHandler(state, handleDiscardAction, action, context);

    expect(state.zones.hand[PLAYER_2].cards).toEqual([CARD_5]);
    expect(state.zones.trash[PLAYER_2].cards).toContain(CARD_4);
  });

  it("should discard random cards when random is true", () => {
    state = produce(state, (draft) => {
      draft.zones.hand[PLAYER_1].cards = [CARD_1, CARD_2, CARD_3, CARD_4, CARD_5];
    });

    const action: DiscardAction = {
      count: 2,
      player: "self",
      random: true,
      type: "DISCARD",
    };

    state = executeHandler(state, handleDiscardAction, action, context);

    // Should have 3 cards remaining
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(3);
    // Should have 2 cards in trash
    expect(state.zones.trash[PLAYER_1].cards.length).toBe(2);
  });

  it("should discard from top when no targets provided", () => {
    state = produce(state, (draft) => {
      draft.zones.hand[PLAYER_1].cards = [CARD_1, CARD_2, CARD_3];
    });

    const action: DiscardAction = {
      count: 2,
      player: "self",
      type: "DISCARD",
    };

    state = executeHandler(state, handleDiscardAction, action, context);

    expect(state.zones.hand[PLAYER_1].cards).toEqual([CARD_3]);
    expect(state.zones.trash[PLAYER_1].cards).toEqual([CARD_1, CARD_2]);
  });

  it("should handle empty hand gracefully", () => {
    state = produce(state, (draft) => {
      draft.zones.hand[PLAYER_1].cards = [];
    });

    const action: DiscardAction = {
      count: 2,
      player: "self",
      type: "DISCARD",
    };

    state = executeHandler(state, handleDiscardAction, action, context);

    expect(state.zones.hand[PLAYER_1].cards).toHaveLength(0);
  });
});

// ============================================================================
// MODIFY STATS ACTION TESTS
// ============================================================================

describe("handleModifyStatsAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    resetModifierCounter();
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should create end of turn modifier", () => {
    const action: ModifyStatsAction = {
      apModifier: 2,
      duration: "this_turn",
      hpModifier: 1,
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "MODIFY_STATS",
    };

    context.targets = [CARD_1];
    handleModifyStatsAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]).toBeDefined();
    expect(state.gundam.temporaryModifiers[CARD_1]!.length).toBe(1);
    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      apModifier: 2,
      duration: "end_of_turn",
      hpModifier: 1,
      sourceId: SOURCE_CARD,
    });
  });

  it("should create permanent modifier", () => {
    const action: ModifyStatsAction = {
      apModifier: 3,
      duration: "permanent",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "MODIFY_STATS",
    };

    context.targets = [CARD_1];
    handleModifyStatsAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      apModifier: 3,
      duration: "permanent",
    });
  });

  it("should create end of combat modifier", () => {
    const action: ModifyStatsAction = {
      duration: "end_of_combat",
      hpModifier: -1,
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "MODIFY_STATS",
    };

    context.targets = [CARD_1];
    handleModifyStatsAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      duration: "end_of_combat",
      hpModifier: -1,
    });
  });

  it("should handle multiple targets", () => {
    const action: ModifyStatsAction = {
      apModifier: 1,
      duration: "this_turn",
      target: {
        chooser: "controller",
        count: 2,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "MODIFY_STATS",
    };

    context.targets = [CARD_1, CARD_2];
    handleModifyStatsAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]).toBeDefined();
    expect(state.gundam.temporaryModifiers[CARD_2]).toBeDefined();
  });

  it("should handle empty targets", () => {
    const action: ModifyStatsAction = {
      apModifier: 2,
      duration: "this_turn",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "MODIFY_STATS",
    };

    handleModifyStatsAction(state, action, context);

    // Should not crash
    expect(state).toBeDefined();
  });

  it("should stack multiple modifiers on same card", () => {
    const action: ModifyStatsAction = {
      apModifier: 1,
      duration: "this_turn",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "MODIFY_STATS",
    };

    context.targets = [CARD_1];
    handleModifyStatsAction(state, action, context);
    handleModifyStatsAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]!.length).toBe(2);
  });
});

// ============================================================================
// GRANT KEYWORD ACTION TESTS
// ============================================================================

describe("handleGrantKeywordAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    resetModifierCounter();
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should grant keyword for this turn", () => {
    const action: GrantKeywordAction = {
      duration: "this_turn",
      keyword: "Mobile",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "GRANT_KEYWORD",
    };

    context.targets = [CARD_1];
    handleGrantKeywordAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      duration: "end_of_turn",
      grantedKeywords: ["Mobile"],
      sourceId: SOURCE_CARD,
    });
  });

  it("should grant keyword permanently", () => {
    const action: GrantKeywordAction = {
      duration: "permanent",
      keyword: "Breach",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "GRANT_KEYWORD",
    };

    context.targets = [CARD_1];
    handleGrantKeywordAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      duration: "permanent",
      grantedKeywords: ["Breach"],
    });
  });

  it("should grant keyword with condition", () => {
    const action: GrantKeywordAction = {
      condition: "has-pilot",
      duration: "while_condition",
      keyword: "Support",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "GRANT_KEYWORD",
    };

    context.targets = [CARD_1];
    handleGrantKeywordAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      condition: "has-pilot",
      duration: "while_condition",
      grantedKeywords: ["Support"],
    });
  });

  it("should handle different keywords", () => {
    const keywords = [
      "Repair",
      "Breach",
      "Support",
      "Blocker",
      "FirstStrike",
      "HighManeuver",
      "Assassin",
      "Intercept",
      "Mobile",
      "Counter",
      "Pilot",
      "Transform",
      "Brave",
      "Alert",
    ] as const;

    for (const keyword of keywords) {
      resetModifierCounter();
      // Create fresh state for each iteration
      const freshState = createInitialGameState();
      const action: GrantKeywordAction = {
        duration: "this_turn",
        keyword,
        target: {
          chooser: "controller",
          count: 1,
          timing: "on_resolution",
          validTargets: [{ owner: "self", type: "unit" }],
        },
        type: "GRANT_KEYWORD",
      };

      const freshContext = createMockContext(PLAYER_1, [CARD_1]);
      handleGrantKeywordAction(freshState, action, freshContext);

      expect(freshState.gundam.temporaryModifiers[CARD_1]![0].grantedKeywords).toEqual([keyword]);
    }
  });
});

// ============================================================================
// SEARCH ACTION TESTS
// ============================================================================

describe("handleSearchAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should search deck and move cards to hand", () => {
    const action: SearchAction = {
      count: 2,
      destination: "hand",
      filter: {},
      reveal: true,
      shuffleAfter: false,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should have 2 cards in hand
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(2);
    // Deck should have 1 card remaining
    expect(state.zones.deck[PLAYER_1].cards.length).toBe(1);
  });

  it("should search from a specified source zone", () => {
    // Add cards to trash for searching
    state = produce(state, (draft) => {
      draft.zones.trash[PLAYER_1].cards = [CARD_4, CARD_5];
    });

    const action: SearchAction = {
      count: 1,
      destination: "hand",
      filter: {},
      reveal: true,
      shuffleAfter: false,
      sourceZone: "trash",
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should have 1 card in hand from trash
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(1);
    expect(state.zones.trash[PLAYER_1].cards.length).toBe(1);
    // Deck should remain unchanged
    expect(state.zones.deck[PLAYER_1].cards.length).toBe(3);
  });

  it("should shuffle source zone after search when specified", () => {
    const action: SearchAction = {
      count: 1,
      destination: "hand",
      filter: {},
      reveal: false,
      shuffleAfter: true,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should have 1 card in hand
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(1);
    // Deck should be shuffled (2 cards remain)
    expect(state.zones.deck[PLAYER_1].cards.length).toBe(2);
  });

  it("should limit search to count", () => {
    const action: SearchAction = {
      count: 1,
      destination: "hand",
      filter: {},
      reveal: true,
      shuffleAfter: false,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should only move 1 card even though deck has 3
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(1);
    expect(state.zones.deck[PLAYER_1].cards.length).toBe(2);
  });

  it("should handle empty source zone", () => {
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [];
    });

    const action: SearchAction = {
      count: 2,
      destination: "hand",
      filter: {},
      reveal: true,
      shuffleAfter: false,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should have 0 cards in hand
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(0);
  });

  it("should surface revealed cards when reveal is true", () => {
    const action: SearchAction = {
      count: 2,
      destination: "hand",
      filter: {},
      reveal: true,
      shuffleAfter: false,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Verify revealed cards are tracked
    expect(state.gundam.revealedCards).toHaveLength(2);
    expect(state.gundam.revealedCards).toContain(CARD_1);
    expect(state.gundam.revealedCards).toContain(CARD_2);
  });

  it("should not track revealed cards when reveal is false", () => {
    const action: SearchAction = {
      count: 2,
      destination: "hand",
      filter: {},
      reveal: false,
      shuffleAfter: false,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Verify revealed cards are not tracked
    expect(state.gundam.revealedCards).toHaveLength(0);
  });

  it("should filter by card type", () => {
    // Register card definitions
    const { registerCardDefinition, clearCardDefinitions } = require("../action-handlers");

    registerCardDefinition(CARD_1, {
      cardType: "UNIT",
      cost: 2,
      hp: 5,
      id: CARD_1,
      level: 3,
      name: "Unit 1",
    });

    registerCardDefinition(CARD_2, {
      cardType: "COMMAND",
      cost: 1,
      id: CARD_2,
      level: 1,
      name: "Command 1",
    });

    registerCardDefinition(CARD_3, {
      cardType: "UNIT",
      cost: 3,
      hp: 6,
      id: CARD_3,
      level: 4,
      name: "Unit 2",
    });

    const action: SearchAction = {
      count: 5,
      destination: "hand",
      filter: { cardType: "UNIT" },
      reveal: false,
      shuffleAfter: false,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should only move UNIT cards
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(2);
    expect(state.zones.hand[PLAYER_1].cards).toContain(CARD_1);
    expect(state.zones.hand[PLAYER_1].cards).toContain(CARD_3);
    expect(state.zones.hand[PLAYER_1].cards).not.toContain(CARD_2);

    // Clean up
    clearCardDefinitions();
  });

  it("should filter by cost range", () => {
    const { registerCardDefinition, clearCardDefinitions } = require("../action-handlers");

    registerCardDefinition(CARD_1, {
      cardType: "UNIT",
      cost: 1,
      hp: 4,
      id: CARD_1,
      level: 2,
      name: "Unit 1",
    });

    registerCardDefinition(CARD_2, {
      cardType: "UNIT",
      cost: 3,
      hp: 5,
      id: CARD_2,
      level: 3,
      name: "Unit 2",
    });

    registerCardDefinition(CARD_3, {
      cardType: "UNIT",
      cost: 5,
      hp: 7,
      id: CARD_3,
      level: 4,
      name: "Unit 3",
    });

    const action: SearchAction = {
      count: 5,
      destination: "hand",
      filter: { cost: { max: 3 } },
      reveal: false,
      shuffleAfter: false,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should only move cards with cost <= 3
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(2);
    expect(state.zones.hand[PLAYER_1].cards).toContain(CARD_1);
    expect(state.zones.hand[PLAYER_1].cards).toContain(CARD_2);
    expect(state.zones.hand[PLAYER_1].cards).not.toContain(CARD_3);

    // Clean up
    clearCardDefinitions();
  });

  it("should use deterministic shuffle seed", () => {
    // Run search twice with same setup
    const action: SearchAction = {
      count: 1,
      destination: "hand",
      filter: {},
      reveal: false,
      shuffleAfter: true,
      type: "SEARCH",
    };

    // First run
    const state1 = createInitialGameState();
    const context1 = createMockContext();
    const result1 = executeHandler(state1, handleSearchAction, action, context1);

    // Second run with identical setup
    const state2 = createInitialGameState();
    const context2 = createMockContext();
    const result2 = executeHandler(state2, handleSearchAction, action, context2);

    // Shuffled decks should be identical (deterministic)
    expect(result1.zones.deck[PLAYER_1].cards).toEqual(result2.zones.deck[PLAYER_1].cards);
  });

  it("should filter by color", () => {
    const { registerCardDefinition, clearCardDefinitions } = require("../action-handlers");

    registerCardDefinition(CARD_1, {
      cardType: "UNIT",
      color: "Red",
      cost: 2,
      hp: 5,
      id: CARD_1,
      level: 3,
      name: "Red Unit",
    });

    registerCardDefinition(CARD_2, {
      cardType: "UNIT",
      color: "Blue",
      cost: 2,
      hp: 5,
      id: CARD_2,
      level: 3,
      name: "Blue Unit",
    });

    registerCardDefinition(CARD_3, {
      cardType: "UNIT",
      color: "Red",
      cost: 2,
      hp: 5,
      id: CARD_3,
      level: 3,
      name: "Another Red Unit",
    });

    const action: SearchAction = {
      count: 5,
      destination: "hand",
      filter: { color: "Red" },
      reveal: false,
      shuffleAfter: false,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should only move Red cards
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(2);
    expect(state.zones.hand[PLAYER_1].cards).toContain(CARD_1);
    expect(state.zones.hand[PLAYER_1].cards).toContain(CARD_3);
    expect(state.zones.hand[PLAYER_1].cards).not.toContain(CARD_2);

    // Clean up
    clearCardDefinitions();
  });

  it("should filter by keyword", () => {
    const { registerCardDefinition, clearCardDefinitions } = require("../action-handlers");

    registerCardDefinition(CARD_1, {
      cardType: "UNIT",
      cost: 2,
      hp: 5,
      id: CARD_1,
      keywords: ["Mobile"],
      level: 3,
      name: "Unit 1",
    });

    registerCardDefinition(CARD_2, {
      cardType: "UNIT",
      cost: 2,
      hp: 5,
      id: CARD_2,
      keywords: ["Breach"],
      level: 3,
      name: "Unit 2",
    });

    registerCardDefinition(CARD_3, {
      cardType: "UNIT",
      cost: 2,
      hp: 5,
      id: CARD_3,
      keywords: ["Mobile"],
      level: 3,
      name: "Unit 3",
    });

    const action: SearchAction = {
      count: 5,
      destination: "hand",
      filter: { hasKeyword: "Mobile" },
      reveal: false,
      shuffleAfter: false,
      type: "SEARCH",
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should only move Mobile cards
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(2);
    expect(state.zones.hand[PLAYER_1].cards).toContain(CARD_1);
    expect(state.zones.hand[PLAYER_1].cards).toContain(CARD_3);
    expect(state.zones.hand[PLAYER_1].cards).not.toContain(CARD_2);

    // Clean up
    clearCardDefinitions();
  });
});

// ============================================================================
// ACTION DISPATCHER TESTS
// ============================================================================

describe("executeAction", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    resetModifierCounter();
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should route DRAW action to correct handler", () => {
    const action: DrawAction = {
      count: 1,
      player: "self",
      type: "DRAW",
    };

    state = produce(state, (draft) => {
      executeAction(draft, action, context);
    });

    expect(state.zones.hand[PLAYER_1].cards.length).toBe(1);
  });

  it("should route REST action to correct handler", () => {
    state = produce(state, (draft) => {
      // Remove CARD_1 from deck and add to battle area
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const action: RestAction = {
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "REST",
    };

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeAction(draft, action, context);
    });

    expect(state.gundam.cardPositions[CARD_1]).toBe("rested");
  });

  it("should route MODIFY_STATS action to correct handler", () => {
    const action: ModifyStatsAction = {
      apModifier: 2,
      duration: "this_turn",
      target: {
        chooser: "controller",
        count: 1,
        timing: "on_resolution",
        validTargets: [{ owner: "self", type: "unit" }],
      },
      type: "MODIFY_STATS",
    };

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeAction(draft, action, context);
    });

    expect(state.gundam.temporaryModifiers[CARD_1]).toBeDefined();
  });
});

// ============================================================================
// BATCH ACTION EXECUTION TESTS
// ============================================================================

describe("executeActions", () => {
  let state: GundamGameState;
  let context: ActionContext;

  beforeEach(() => {
    resetModifierCounter();
    state = createInitialGameState();
    context = createMockContext();
  });

  it("should execute multiple actions in sequence", () => {
    state = produce(state, (draft) => {
      // Remove CARD_1 from deck and add to battle area
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
      draft.gundam.cardPositions[CARD_1] = "active";
    });

    const actions: EffectAction[] = [
      {
        target: {
          chooser: "controller",
          count: 1,
          timing: "on_resolution",
          validTargets: [{ owner: "self", type: "unit" }],
        },
        type: "REST",
      },
      {
        apModifier: 2,
        duration: "this_turn",
        target: {
          chooser: "controller",
          count: 1,
          timing: "on_resolution",
          validTargets: [{ owner: "self", type: "unit" }],
        },
        type: "MODIFY_STATS",
      },
    ];

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    expect(state.gundam.cardPositions[CARD_1]).toBe("rested");
    expect(state.gundam.temporaryModifiers[CARD_1]).toBeDefined();
  });

  it("should execute draw then damage", () => {
    const actions: EffectAction[] = [
      {
        count: 2,
        player: "self",
        type: "DRAW",
      },
      {
        amount: 2,
        damageType: "effect",
        target: "unit",
        type: "DAMAGE",
      },
    ];

    state = produce(state, (draft) => {
      executeActions(draft, actions, context);
    });

    expect(state.zones.hand[PLAYER_1].cards.length).toBe(2);
  });
});

// ============================================================================
// HELPER FUNCTION TESTS
// ============================================================================

describe("createModifierId", () => {
  beforeEach(() => {
    resetModifierCounter();
  });

  it("should create unique modifier IDs", () => {
    const id1 = createModifierId("test");
    const id2 = createModifierId("test");

    expect(id1).toBe("test-0" as any);
    expect(id2).toBe("test-1" as any);
    expect(id1).not.toBe(id2);
  });

  it("should use default prefix when not provided", () => {
    const id = createModifierId();
    expect(id).toBe("mod-0" as any);
  });
});

describe("getOpponentPlayer", () => {
  it("should return the opponent player ID", () => {
    const state = createInitialGameState();

    const opponent = getOpponentPlayer(PLAYER_1, state);
    expect(opponent).toBe(PLAYER_2);
  });

  it("should return null when player not found", () => {
    const state = createInitialGameState();

    const opponent = getOpponentPlayer("unknown" as PlayerId, state);
    expect(opponent).toBe(PLAYER_1); // First player found
  });
});

describe("findCardZone", () => {
  it("should find card in battle area", () => {
    const state = produce(createInitialGameState(), (draft) => {
      // Remove CARD_1 from deck and add to battle area
      draft.zones.deck[PLAYER_1].cards = [CARD_2, CARD_3];
      draft.zones.battleArea[PLAYER_1].cards = [CARD_1];
    });

    const result = findCardZone(CARD_1, state);

    expect(result).toEqual({
      owner: PLAYER_1,
      zone: "battleArea",
    });
  });

  it("should return null when card not found", () => {
    const state = createInitialGameState();

    const result = findCardZone("unknown" as CardId, state);

    expect(result).toBeNull();
  });
});

describe("resolvePlayerRef", () => {
  it("should resolve self to controller", () => {
    const state = createInitialGameState();
    const context = createMockContext(PLAYER_1);

    const result = resolvePlayerRef("self", context, state);

    expect(result).toBe(PLAYER_1);
  });

  it("should resolve opponent to other player", () => {
    const state = createInitialGameState();
    const context = createMockContext(PLAYER_1);

    const result = resolvePlayerRef("opponent", context, state);

    expect(result).toBe(PLAYER_2);
  });

  it("should return direct player ID", () => {
    const state = createInitialGameState();
    const context = createMockContext(PLAYER_1);

    const result = resolvePlayerRef(PLAYER_2, context, state);

    expect(result).toBe(PLAYER_2);
  });
});

describe("resolveSimpleTarget", () => {
  it("should return targets from context when available", () => {
    const state = createInitialGameState();
    const context = createMockContext(PLAYER_1, [CARD_1, CARD_2]);

    const spec = {
      chooser: "controller" as const,
      count: 1,
      timing: "on_resolution" as const,
      validTargets: [{ owner: "self" as const, type: "unit" as const }],
    };

    const result = resolveSimpleTarget(spec, context, state);

    expect(result).toEqual([CARD_1]);
  });

  it("should respect count parameter", () => {
    const state = createInitialGameState();
    const context = createMockContext(PLAYER_1, [CARD_1, CARD_2, CARD_3]);

    const spec = {
      chooser: "controller" as const,
      count: 2,
      timing: "on_resolution" as const,
      validTargets: [{ owner: "self" as const, type: "unit" as const }],
    };

    const result = resolveSimpleTarget(spec, context, state);

    expect(result).toEqual([CARD_1, CARD_2]);
  });

  it("should return empty array when no targets in context", () => {
    const state = createInitialGameState();
    const context = createMockContext(PLAYER_1);

    const spec = {
      chooser: "controller" as const,
      count: 1,
      timing: "on_resolution" as const,
      validTargets: [{ owner: "self" as const, type: "unit" as const }],
    };

    const result = resolveSimpleTarget(spec, context, state);

    expect(result).toEqual([]);
  });
});

// Type import for EffectAction used in tests
type EffectAction =
  | DrawAction
  | DamageAction
  | RestAction
  | ActivateAction
  | MoveCardAction
  | DestroyAction
  | DiscardAction
  | ModifyStatsAction
  | GrantKeywordAction
  | SearchAction;
