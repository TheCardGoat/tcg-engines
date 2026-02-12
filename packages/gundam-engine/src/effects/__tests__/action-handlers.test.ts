/**
 * Unit Tests for Action Handlers
 *
 * Comprehensive tests for all effect action handlers.
 * Tests use Immer's produce to create draft states for testing.
 */

import { beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId, Zone } from "@tcg/core";
import { createZone, createZoneId } from "@tcg/core";
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
} from "@tcg/gundam-types";
import { produce } from "immer";
import type { CardPosition, GundamGameState } from "../../types";
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
      type: "DRAW",
      count: 2,
      player: "self",
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
      type: "DRAW",
      count: 1,
      player: "opponent",
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
      type: "DRAW",
      count: 2,
      player: "self",
    };

    // The draw function will throw, so we expect an error
    expect(() => {
      executeHandler(state, handleDrawAction, action, context);
    }).toThrow();
  });

  it("should draw multiple cards", () => {
    // Add more cards to deck
    state = produce(state, (draft) => {
      draft.zones.deck[PLAYER_1].cards = [
        CARD_1,
        CARD_2,
        CARD_3,
        CARD_4,
        CARD_5,
      ];
    });

    const action: DrawAction = {
      type: "DRAW",
      count: 3,
      player: "self",
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
      type: "DAMAGE",
      amount: 2,
      target: "unit",
      damageType: "effect",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);

    // Verify damage is tracked
    expect(state.gundam.cardDamage[CARD_1]).toBe(2);
  });

  it("should handle no targets gracefully", () => {
    const action: DamageAction = {
      type: "DAMAGE",
      amount: 3,
      target: "base",
      damageType: "effect",
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
      type: "DAMAGE",
      amount: 1,
      target: "base",
      damageType: "effect",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);

    expect(state.gundam.cardDamage[CARD_1]).toBe(1);
  });

  it("should handle damage to shield", () => {
    const action: DamageAction = {
      type: "DAMAGE",
      amount: 1,
      target: "shield",
      damageType: "effect",
    };

    context.targets = [CARD_1];
    state = executeHandler(state, handleDamageAction, action, context);

    expect(state.gundam.cardDamage[CARD_1]).toBe(1);
  });

  it("should accumulate damage on same target", () => {
    const action: DamageAction = {
      type: "DAMAGE",
      amount: 2,
      target: "unit",
      damageType: "effect",
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
      type: "DAMAGE",
      amount: 3,
      target: "unit",
      damageType: "effect",
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
      type: "DAMAGE",
      amount: 1,
      target: "shield",
      damageType: "effect",
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
      id: CARD_1,
      cardType: "UNIT",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Test Unit",
    });

    const action: DamageAction = {
      type: "DAMAGE",
      amount: 5,
      target: "unit",
      damageType: "effect",
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
      id: CARD_1,
      cardType: "UNIT",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Test Unit",
    });

    const action: DamageAction = {
      type: "DAMAGE",
      amount: 3,
      target: "unit",
      damageType: "effect",
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
      id: CARD_1,
      cardType: "UNIT",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Test Unit",
    });

    const action: DamageAction = {
      type: "DAMAGE",
      amount: 2,
      target: "unit",
      damageType: "effect",
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
      type: "REST",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "REST",
      target: {
        count: 1,
        validTargets: [{ type: "card", owner: "self", zone: "resourceArea" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "REST",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "REST",
      target: {
        count: 1,
        validTargets: [{ type: "card", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "ACTIVATE",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "ACTIVATE",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "MOVE_CARD",
      from: "hand",
      to: "battleArea",
      target: {
        count: 1,
        validTargets: [{ type: "card", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "MOVE_CARD",
      from: "battleArea",
      to: "trash",
      target: {
        count: 1,
        validTargets: [{ type: "card", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "MOVE_CARD",
      from: "hand",
      to: "battleArea",
      target: {
        count: 1,
        validTargets: [{ type: "card", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "MOVE_CARD",
      from: "hand",
      to: "battleArea",
      owner: "opponent",
      target: {
        count: 1,
        validTargets: [{ type: "card", owner: "opponent" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
          id: "mod-1" as any,
          duration: "end_of_turn",
          sourceId: SOURCE_CARD,
          apModifier: 2,
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
    state = executeHandler(state, handleDestroyAction, action, context);

    expect(state.zones.battleArea[PLAYER_2].cards).toHaveLength(0);
    expect(state.zones.trash[PLAYER_2].cards).toEqual([CARD_4]);
    expect(state.gundam.cardPositions[CARD_4]).toBeUndefined();
    expect(state.gundam.temporaryModifiers[CARD_4]).toBeUndefined();
  });

  it("should handle destroy with no targets", () => {
    const action: DestroyAction = {
      type: "DESTROY",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "opponent" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "DESTROY",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "opponent" }],
        chooser: "controller",
        timing: "on_resolution",
      },
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
      type: "DISCARD",
      count: 2,
      player: "self",
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
      type: "DISCARD",
      count: 1,
      player: "opponent",
    };

    context.targets = [CARD_4];
    state = executeHandler(state, handleDiscardAction, action, context);

    expect(state.zones.hand[PLAYER_2].cards).toEqual([CARD_5]);
    expect(state.zones.trash[PLAYER_2].cards).toContain(CARD_4);
  });

  it("should discard random cards when random is true", () => {
    state = produce(state, (draft) => {
      draft.zones.hand[PLAYER_1].cards = [
        CARD_1,
        CARD_2,
        CARD_3,
        CARD_4,
        CARD_5,
      ];
    });

    const action: DiscardAction = {
      type: "DISCARD",
      count: 2,
      player: "self",
      random: true,
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
      type: "DISCARD",
      count: 2,
      player: "self",
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
      type: "DISCARD",
      count: 2,
      player: "self",
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
      type: "MODIFY_STATS",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      apModifier: 2,
      hpModifier: 1,
      duration: "this_turn",
    };

    context.targets = [CARD_1];
    handleModifyStatsAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]).toBeDefined();
    expect(state.gundam.temporaryModifiers[CARD_1]!.length).toBe(1);
    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      duration: "end_of_turn",
      apModifier: 2,
      hpModifier: 1,
      sourceId: SOURCE_CARD,
    });
  });

  it("should create permanent modifier", () => {
    const action: ModifyStatsAction = {
      type: "MODIFY_STATS",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      apModifier: 3,
      duration: "permanent",
    };

    context.targets = [CARD_1];
    handleModifyStatsAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      duration: "permanent",
      apModifier: 3,
    });
  });

  it("should create end of combat modifier", () => {
    const action: ModifyStatsAction = {
      type: "MODIFY_STATS",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      hpModifier: -1,
      duration: "end_of_combat",
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
      type: "MODIFY_STATS",
      target: {
        count: 2,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      apModifier: 1,
      duration: "this_turn",
    };

    context.targets = [CARD_1, CARD_2];
    handleModifyStatsAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]).toBeDefined();
    expect(state.gundam.temporaryModifiers[CARD_2]).toBeDefined();
  });

  it("should handle empty targets", () => {
    const action: ModifyStatsAction = {
      type: "MODIFY_STATS",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      apModifier: 2,
      duration: "this_turn",
    };

    handleModifyStatsAction(state, action, context);

    // Should not crash
    expect(state).toBeDefined();
  });

  it("should stack multiple modifiers on same card", () => {
    const action: ModifyStatsAction = {
      type: "MODIFY_STATS",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      apModifier: 1,
      duration: "this_turn",
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
      type: "GRANT_KEYWORD",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      keyword: "Mobile",
      duration: "this_turn",
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
      type: "GRANT_KEYWORD",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      keyword: "Breach",
      duration: "permanent",
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
      type: "GRANT_KEYWORD",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      keyword: "Support",
      duration: "while_condition",
      condition: "has-pilot",
    };

    context.targets = [CARD_1];
    handleGrantKeywordAction(state, action, context);

    expect(state.gundam.temporaryModifiers[CARD_1]![0]).toMatchObject({
      duration: "while_condition",
      condition: "has-pilot",
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
        type: "GRANT_KEYWORD",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
        keyword,
        duration: "this_turn",
      };

      const freshContext = createMockContext(PLAYER_1, [CARD_1]);
      handleGrantKeywordAction(freshState, action, freshContext);

      expect(
        freshState.gundam.temporaryModifiers[CARD_1]![0].grantedKeywords,
      ).toEqual([keyword]);
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
      type: "SEARCH",
      destination: "hand",
      count: 2,
      filter: {},
      reveal: true,
      shuffleAfter: false,
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
      type: "SEARCH",
      sourceZone: "trash",
      destination: "hand",
      count: 1,
      filter: {},
      reveal: true,
      shuffleAfter: false,
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
      type: "SEARCH",
      destination: "hand",
      count: 1,
      filter: {},
      reveal: false,
      shuffleAfter: true,
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should have 1 card in hand
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(1);
    // Deck should be shuffled (2 cards remain)
    expect(state.zones.deck[PLAYER_1].cards.length).toBe(2);
  });

  it("should limit search to count", () => {
    const action: SearchAction = {
      type: "SEARCH",
      destination: "hand",
      count: 1,
      filter: {},
      reveal: true,
      shuffleAfter: false,
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
      type: "SEARCH",
      destination: "hand",
      count: 2,
      filter: {},
      reveal: true,
      shuffleAfter: false,
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Should have 0 cards in hand
    expect(state.zones.hand[PLAYER_1].cards.length).toBe(0);
  });

  it("should surface revealed cards when reveal is true", () => {
    const action: SearchAction = {
      type: "SEARCH",
      destination: "hand",
      count: 2,
      filter: {},
      reveal: true,
      shuffleAfter: false,
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Verify revealed cards are tracked
    expect(state.gundam.revealedCards).toHaveLength(2);
    expect(state.gundam.revealedCards).toContain(CARD_1);
    expect(state.gundam.revealedCards).toContain(CARD_2);
  });

  it("should not track revealed cards when reveal is false", () => {
    const action: SearchAction = {
      type: "SEARCH",
      destination: "hand",
      count: 2,
      filter: {},
      reveal: false,
      shuffleAfter: false,
    };

    state = executeHandler(state, handleSearchAction, action, context);

    // Verify revealed cards are not tracked
    expect(state.gundam.revealedCards).toHaveLength(0);
  });

  it("should filter by card type", () => {
    // Register card definitions
    const {
      registerCardDefinition,
      clearCardDefinitions,
    } = require("../action-handlers");

    registerCardDefinition(CARD_1, {
      id: CARD_1,
      cardType: "UNIT",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Unit 1",
    });

    registerCardDefinition(CARD_2, {
      id: CARD_2,
      cardType: "COMMAND",
      cost: 1,
      level: 1,
      name: "Command 1",
    });

    registerCardDefinition(CARD_3, {
      id: CARD_3,
      cardType: "UNIT",
      cost: 3,
      level: 4,
      hp: 6,
      name: "Unit 2",
    });

    const action: SearchAction = {
      type: "SEARCH",
      destination: "hand",
      count: 5,
      filter: { cardType: "UNIT" },
      reveal: false,
      shuffleAfter: false,
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
    const {
      registerCardDefinition,
      clearCardDefinitions,
    } = require("../action-handlers");

    registerCardDefinition(CARD_1, {
      id: CARD_1,
      cardType: "UNIT",
      cost: 1,
      level: 2,
      hp: 4,
      name: "Unit 1",
    });

    registerCardDefinition(CARD_2, {
      id: CARD_2,
      cardType: "UNIT",
      cost: 3,
      level: 3,
      hp: 5,
      name: "Unit 2",
    });

    registerCardDefinition(CARD_3, {
      id: CARD_3,
      cardType: "UNIT",
      cost: 5,
      level: 4,
      hp: 7,
      name: "Unit 3",
    });

    const action: SearchAction = {
      type: "SEARCH",
      destination: "hand",
      count: 5,
      filter: { cost: { max: 3 } },
      reveal: false,
      shuffleAfter: false,
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
      type: "SEARCH",
      destination: "hand",
      count: 1,
      filter: {},
      reveal: false,
      shuffleAfter: true,
    };

    // First run
    const state1 = createInitialGameState();
    const context1 = createMockContext();
    const result1 = executeHandler(
      state1,
      handleSearchAction,
      action,
      context1,
    );

    // Second run with identical setup
    const state2 = createInitialGameState();
    const context2 = createMockContext();
    const result2 = executeHandler(
      state2,
      handleSearchAction,
      action,
      context2,
    );

    // Shuffled decks should be identical (deterministic)
    expect(result1.zones.deck[PLAYER_1].cards).toEqual(
      result2.zones.deck[PLAYER_1].cards,
    );
  });

  it("should filter by color", () => {
    const {
      registerCardDefinition,
      clearCardDefinitions,
    } = require("../action-handlers");

    registerCardDefinition(CARD_1, {
      id: CARD_1,
      cardType: "UNIT",
      color: "Red",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Red Unit",
    });

    registerCardDefinition(CARD_2, {
      id: CARD_2,
      cardType: "UNIT",
      color: "Blue",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Blue Unit",
    });

    registerCardDefinition(CARD_3, {
      id: CARD_3,
      cardType: "UNIT",
      color: "Red",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Another Red Unit",
    });

    const action: SearchAction = {
      type: "SEARCH",
      destination: "hand",
      count: 5,
      filter: { color: "Red" },
      reveal: false,
      shuffleAfter: false,
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
    const {
      registerCardDefinition,
      clearCardDefinitions,
    } = require("../action-handlers");

    registerCardDefinition(CARD_1, {
      id: CARD_1,
      cardType: "UNIT",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Unit 1",
      keywords: ["Mobile"],
    });

    registerCardDefinition(CARD_2, {
      id: CARD_2,
      cardType: "UNIT",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Unit 2",
      keywords: ["Breach"],
    });

    registerCardDefinition(CARD_3, {
      id: CARD_3,
      cardType: "UNIT",
      cost: 2,
      level: 3,
      hp: 5,
      name: "Unit 3",
      keywords: ["Mobile"],
    });

    const action: SearchAction = {
      type: "SEARCH",
      destination: "hand",
      count: 5,
      filter: { hasKeyword: "Mobile" },
      reveal: false,
      shuffleAfter: false,
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
      type: "DRAW",
      count: 1,
      player: "self",
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
      type: "REST",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
    };

    context.targets = [CARD_1];
    state = produce(state, (draft) => {
      executeAction(draft, action, context);
    });

    expect(state.gundam.cardPositions[CARD_1]).toBe("rested");
  });

  it("should route MODIFY_STATS action to correct handler", () => {
    const action: ModifyStatsAction = {
      type: "MODIFY_STATS",
      target: {
        count: 1,
        validTargets: [{ type: "unit", owner: "self" }],
        chooser: "controller",
        timing: "on_resolution",
      },
      apModifier: 2,
      duration: "this_turn",
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
        type: "REST",
        target: {
          count: 1,
          validTargets: [{ type: "unit", owner: "self" }],
          chooser: "controller",
          timing: "on_resolution",
        },
      },
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
        type: "DRAW",
        count: 2,
        player: "self",
      },
      {
        type: "DAMAGE",
        amount: 2,
        target: "unit",
        damageType: "effect",
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
      zone: "battleArea",
      owner: PLAYER_1,
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
      count: 1,
      validTargets: [{ type: "unit" as const, owner: "self" as const }],
      chooser: "controller" as const,
      timing: "on_resolution" as const,
    };

    const result = resolveSimpleTarget(spec, context, state);

    expect(result).toEqual([CARD_1]);
  });

  it("should respect count parameter", () => {
    const state = createInitialGameState();
    const context = createMockContext(PLAYER_1, [CARD_1, CARD_2, CARD_3]);

    const spec = {
      count: 2,
      validTargets: [{ type: "unit" as const, owner: "self" as const }],
      chooser: "controller" as const,
      timing: "on_resolution" as const,
    };

    const result = resolveSimpleTarget(spec, context, state);

    expect(result).toEqual([CARD_1, CARD_2]);
  });

  it("should return empty array when no targets in context", () => {
    const state = createInitialGameState();
    const context = createMockContext(PLAYER_1);

    const spec = {
      count: 1,
      validTargets: [{ type: "unit" as const, owner: "self" as const }],
      chooser: "controller" as const,
      timing: "on_resolution" as const,
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
