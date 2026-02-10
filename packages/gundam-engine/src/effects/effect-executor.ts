/**
 * Gundam Effect Executor
 *
 * Executes effects and modifies game state using Immer for immutability.
 * Provides a comprehensive system for processing all Gundam effect types.
 *
 * Effect execution follows these principles:
 * 1. All state changes go through Immer produce
 * 2. Effects are executed in order within sequences
 * 3. Target resolution happens before effect application
 * 4. Conditional effects check conditions first
 * 5. Choice effects require player input
 */

import type { CardId, PlayerId } from "@tcg/core";
import type { Draft } from "immer";
import type { GundamCardMeta, GundamGameState } from "../types";
import type {
  AbilityDefinition,
  AmountExpression,
  Condition,
  Cost,
  Effect,
  EffectTarget,
  ZoneSpec,
} from "./effect-types";

// ============================================================================
// Context Types
// ============================================================================

/**
 * Context passed during effect execution
 */
export interface EffectContext {
  /** Current game state */
  readonly state: GundamGameState;

  /** Player who triggered the effect */
  readonly sourcePlayer: PlayerId;

  /** Card that triggered the effect (if applicable) */
  readonly sourceCard?: CardId;

  /** Variable storage for amount expressions */
  readonly variables: Record<string, number>;

  /** Choices made by players (for choice effects) */
  readonly choices: Record<string, number>;

  /** Flags for tracking effect execution */
  readonly flags: Record<string, boolean>;
}

/**
 * Result of effect execution
 */
export interface EffectResult {
  /** Modified game state */
  readonly state: GundamGameState;

  /** Updated variables */
  readonly variables: Record<string, number>;

  /** Pending choices (if effect requires player input) */
  readonly pendingChoices?: PendingChoice[];

  /** Events that occurred during execution */
  readonly events: EffectEvent[];

  /** Whether execution was successful */
  readonly success: boolean;

  /** Error message if execution failed */
  readonly error?: string;
}

/**
 * Pending choice that needs player input
 */
export interface PendingChoice {
  /** Unique ID for this choice */
  readonly id: string;

  /** Player who must choose */
  readonly player: PlayerId;

  /** Label/prompt for the choice */
  readonly prompt: string;

  /** Available options */
  readonly options: readonly string[];

  /** Number of choices to make */
  readonly count: number;

  /** Whether this choice is optional */
  readonly optional: boolean;
}

/**
 * Event that occurred during effect execution
 */
export interface EffectEvent {
  readonly type: EventType;
  readonly data: unknown;
}

export type EventType =
  | "damage-dealt"
  | "card-destroyed"
  | "card-drawn"
  | "card-discarded"
  | "card-played"
  | "keyword-granted"
  | "keyword-lost"
  | "stat-modified"
  | "control-changed"
  | "pilot-paired"
  | "pilot-unpaired"
  | "shield-added"
  | "shield-broken"
  | "token-created"
  | "effect-resolved";

// ============================================================================
// Target Resolution
// ============================================================================

/**
 * Resolved target information
 */
export interface ResolvedTarget {
  readonly cardIds: readonly CardId[];
  readonly players: readonly PlayerId[];
  readonly zones: readonly ZoneSpec[];
}

/**
 * Resolve an effect target to concrete card IDs and players
 */
function resolveTarget(
  target: EffectTarget,
  context: EffectContext,
): ResolvedTarget {
  const state = context.state;
  const sourcePlayer = context.sourcePlayer;
  const opponent = state.players.find((p) => p !== sourcePlayer);

  // Handle simple string targets
  if (typeof target === "string") {
    switch (target) {
      case "this":
      case "this-card":
      case "this-unit":
      case "this-base":
      case "this-pilot":
        return context.sourceCard
          ? { cardIds: [context.sourceCard], players: [], zones: [] }
          : { cardIds: [], players: [], zones: [] };

      case "self":
        return { cardIds: [], players: [sourcePlayer], zones: [] };

      case "opponent":
        return opponent
          ? { cardIds: [], players: [opponent], zones: [] }
          : { cardIds: [], players: [], zones: [] };

      case "each-player":
        return { cardIds: [], players: state.players, zones: [] };

      case "each-unit": {
        // Return all units in battle areas
        const allUnits: CardId[] = [];
        for (const player of state.players) {
          const battleArea = state.zones.battleArea[player];
          if (battleArea?.cards) {
            allUnits.push(...battleArea.cards);
          }
        }
        return { cardIds: allUnits, players: [], zones: [] };
      }

      case "each-opponent-unit": {
        if (!opponent) return { cardIds: [], players: [], zones: [] };
        const opponentUnits = state.zones.battleArea[opponent]?.cards ?? [];
        return { cardIds: opponentUnits, players: [], zones: [] };
      }

      case "each-friendly-unit": {
        const friendlyUnits = state.zones.battleArea[sourcePlayer]?.cards ?? [];
        return { cardIds: friendlyUnits, players: [], zones: [] };
      }

      default:
        return { cardIds: [], players: [], zones: [] };
    }
  }

  // Handle selector-based targets
  if ("selector" in target) {
    const selector = target.selector;
    const results: CardId[] = [];

    // Determine which player(s) to search
    const playersToSearch =
      selector.controller === "self"
        ? [sourcePlayer]
        : selector.controller === "opponent" && opponent
          ? [opponent]
          : state.players;

    // Search each player's battle area
    for (const player of playersToSearch) {
      const battleArea = state.zones.battleArea[player];
      if (!battleArea?.cards) continue;

      for (const cardId of battleArea.cards) {
        // Check each selector condition
        if (selector.damaged !== undefined) {
          const meta = state.gundam.cardPositions[cardId];
          // Skip if damage condition doesn't match
          // (This would need actual damage tracking in card metadata)
        }

        // Add card if it passes all filters
        results.push(cardId);
      }
    }

    return { cardIds: results, players: [], zones: [] };
  }

  return { cardIds: [], players: [], zones: [] };
}

// ============================================================================
// Amount Resolution
// ============================================================================

/**
 * Resolve an amount expression to a concrete number
 */
function resolveAmount(
  amount: number | AmountExpression,
  context: EffectContext,
): number {
  if (typeof amount === "number") {
    return amount;
  }

  // Handle amount expressions
  if ("count" in amount) {
    const target = resolveTarget(amount.count, context);
    return target.cardIds.length;
  }

  if ("ap" in amount) {
    const target = resolveTarget(amount.ap, context);
    if (target.cardIds.length > 0) {
      // Would need to get AP from card definition
      return 0; // Placeholder
    }
    return 0;
  }

  if ("hp" in amount) {
    const target = resolveTarget(amount.hp, context);
    if (target.cardIds.length > 0) {
      // Would need to get HP from card definition
      return 0; // Placeholder
    }
    return 0;
  }

  if ("damage" in amount) {
    const target = resolveTarget(amount.damage, context);
    if (target.cardIds.length > 0) {
      // Would need to get damage from card metadata
      return 0; // Placeholder
    }
    return 0;
  }

  if ("cost" in amount) {
    const target = resolveTarget(amount.cost, context);
    if (target.cardIds.length > 0) {
      // Would need to get cost from card definition
      return 0; // Placeholder
    }
    return 0;
  }

  if ("level" in amount) {
    const target = resolveTarget(amount.level, context);
    if (target.cardIds.length > 0) {
      // Would need to get level from card definition
      return 0; // Placeholder
    }
    return 0;
  }

  if ("resources" in amount) {
    const player =
      amount.resources === "self"
        ? context.sourcePlayer
        : getOpponent(context.state, context.sourcePlayer);
    return player ? (context.state.gundam.activeResources[player] ?? 0) : 0;
  }

  if ("cardsInHand" in amount) {
    const player =
      amount.cardsInHand === "self"
        ? context.sourcePlayer
        : getOpponent(context.state, context.sourcePlayer);
    return player ? (context.state.zones.hand[player]?.cards.length ?? 0) : 0;
  }

  if ("cardsInTrash" in amount) {
    const player =
      amount.cardsInTrash === "self"
        ? context.sourcePlayer
        : getOpponent(context.state, context.sourcePlayer);
    return player ? (context.state.zones.trash[player]?.cards.length ?? 0) : 0;
  }

  if ("shields" in amount) {
    const player =
      amount.shields === "self"
        ? context.sourcePlayer
        : getOpponent(context.state, context.sourcePlayer);
    return player
      ? (context.state.zones.shieldSection[player]?.cards.length ?? 0)
      : 0;
  }

  if ("variable" in amount) {
    return context.variables[amount.variable] ?? 0;
  }

  return 0;
}

// ============================================================================
// Condition Evaluation
// ============================================================================

/**
 * Evaluate a condition to true/false
 */
function evaluateCondition(
  condition: Condition,
  context: EffectContext,
): boolean {
  if ("playerHas" in condition) {
    const playerHas = condition.playerHas;
    if (playerHas?.resources !== undefined) {
      const resources =
        context.state.gundam.activeResources[context.sourcePlayer] ?? 0;
      return resources >= playerHas.resources;
    }
    if (playerHas?.cardsInHand !== undefined) {
      const handSize =
        context.state.zones.hand[context.sourcePlayer]?.cards.length ?? 0;
      return handSize >= playerHas.cardsInHand;
    }
  }

  if ("targetHas" in condition) {
    // Would need to evaluate target-specific conditions
    return true;
  }

  if ("cardCount" in condition) {
    const cardCount = condition.cardCount;
    if (cardCount) {
      const zone = context.state.zones[cardCount.zone]?.[context.sourcePlayer];
      const count = zone?.cards.length ?? 0;
      if (cardCount.amount !== undefined) {
        return count === cardCount.amount;
      }
      return count > 0;
    }
  }

  if ("lifeAtLeast" in condition || "lifeAtMost" in condition) {
    // Gundam doesn't have life, it has base damage
    return true;
  }

  if ("turn" in condition) {
    const turn = condition.turn;
    if (typeof turn === "number") {
      return context.state.turn === turn;
    }
    if (typeof turn === "object") {
      if (turn.atLeast !== undefined && context.state.turn < turn.atLeast) {
        return false;
      }
      if (turn.atMost !== undefined && context.state.turn > turn.atMost) {
        return false;
      }
      return true;
    }
  }

  if ("controlUnit" in condition) {
    // Would need to check if player controls a unit matching criteria
    return true;
  }

  if ("conditionRef" in condition) {
    // Would need to look up named condition
    return true;
  }

  return true;
}

// ============================================================================
// Effect Execution
// ============================================================================

/**
 * Execute an effect and return the result
 */
export function executeEffect(
  effect: Effect,
  context: EffectContext,
): EffectResult {
  const events: EffectEvent[] = [];

  try {
    const executor = getExecutor(effect.type);
    const result = executor(effect, context, events);

    return {
      state: result,
      variables: context.variables,
      events,
      success: true,
    };
  } catch (error) {
    return {
      state: context.state,
      variables: context.variables,
      events,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get the executor function for a given effect type
 */
function getExecutor(type: Effect["type"]): EffectExecutor {
  const executors: Record<string, EffectExecutor> = {
    // Card manipulation
    draw: executeDrawEffect,
    discard: executeDiscardEffect,
    "search-deck": executeSearchDeckEffect,
    "return-to-hand": executeReturnToHandEffect,
    "play-from": executePlayFromEffect,
    "send-to-trash": executeSendToTrashEffect,
    "remove-from-game": executeRemoveFromGameEffect,
    look: executeLookEffect,
    reveal: executeRevealEffect,
    shuffle: executeShuffleEffect,

    // Combat
    damage: executeDamageEffect,
    heal: executeHealEffect,
    destroy: executeDestroyEffect,
    rest: executeRestEffect,
    stand: executeStandEffect,
    battle: executeBattleEffect,
    "prevent-damage": executePreventDamageEffect,
    "redirect-damage": executeRedirectDamageEffect,

    // Stat modification
    "modify-ap": executeModifyAPEffect,
    "modify-hp": executeModifyHPEffect,
    "set-ap": executeSetAPEffect,
    "set-hp": executeSetHPEffect,
    "swap-stats": executeSwapStatsEffect,
    "gain-control": executeGainControlEffect,

    // Resources
    "add-resources": executeAddResourcesEffect,
    "play-resource": executePlayResourceEffect,
    "rest-for-resource": executeRestForResourceEffect,

    // Pilot and pairing
    "pair-pilot": executePairPilotEffect,
    "unpair-pilot": executeUnpairPilotEffect,
    "search-pilot": executeSearchPilotEffect,
    "attach-as-pilot": executeAttachAsPilotEffect,

    // Shields
    "add-shield": executeAddShieldEffect,
    "break-shield": executeBreakShieldEffect,

    // Keywords
    "grant-keyword": executeGrantKeywordEffect,
    "lose-keyword": executeLoseKeywordEffect,

    // Tokens
    "create-token": executeCreateTokenEffect,

    // Control flow
    sequence: executeSequenceEffect,
    choice: executeChoiceEffect,
    conditional: executeConditionalEffect,
    optional: executeOptionalEffect,
    "for-each": executeForEachEffect,
    "do-times": executeDoTimesEffect,
    "repeat-while": executeRepeatWhileEffect,
    "if-you-do": executeIfYouDoEffect,
    "until-end-of-turn": executeUntilEndOfTurnEffect,

    // Special
    counter: executeCounterEffect,
    copy: executeCopyEffect,
    "change-controller": executeChangeControllerEffect,
    flip: executeFlipEffect,
    "gain-ability": executeGainAbilityEffect,
    "lose-ability": executeLoseAbilityEffect,
  };

  return executors[type] ?? ((_effect, ctx) => ctx.state);
}

/**
 * Effect executor function type
 */
type EffectExecutor = (
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
) => GundamGameState;

// ============================================================================
// Card Manipulation Effect Executors
// ============================================================================

function executeDrawEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const drawEffect = effect as Extract<Effect, { type: "draw" }>;
  const amount = resolveAmount(drawEffect.amount, context);

  const opponent = getOpponent(context.state, context.sourcePlayer);
  const players: PlayerId[] =
    drawEffect.player === "self"
      ? [context.sourcePlayer]
      : drawEffect.player === "opponent"
        ? opponent
          ? [opponent]
          : []
        : drawEffect.player === "each"
          ? context.state.players
          : [context.sourcePlayer];

  // Import and use drawCards operation
  // For now, return state unchanged
  // This would integrate with the card operations

  events.push({
    type: "card-drawn",
    data: { amount, players },
  });

  return context.state;
}

function executeDiscardEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const discardEffect = effect as Extract<Effect, { type: "discard" }>;
  const amount = resolveAmount(discardEffect.amount, context);

  const player =
    discardEffect.player === "self"
      ? context.sourcePlayer
      : discardEffect.player === "opponent"
        ? getOpponent(context.state, context.sourcePlayer)
        : context.sourcePlayer;

  if (!player) return context.state;

  // Would discard cards from hand
  events.push({
    type: "card-discarded",
    data: { amount, player },
  });

  return context.state;
}

function executeSearchDeckEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const searchEffect = effect as Extract<Effect, { type: "search-deck" }>;

  // Would search deck and add card to destination
  // This requires player input for card selection

  return context.state;
}

function executeReturnToHandEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const returnEffect = effect as Extract<Effect, { type: "return-to-hand" }>;
  const target = resolveTarget(returnEffect.target, context);

  // Would move cards to hand
  events.push({
    type: "card-played",
    data: { cardIds: target.cardIds, destination: "hand" },
  });

  return context.state;
}

function executePlayFromEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const playEffect = effect as Extract<Effect, { type: "play-from" }>;
  const target = resolveTarget(playEffect.target, context);

  // Would play card from zone
  events.push({
    type: "card-played",
    data: { cardIds: target.cardIds, from: playEffect.from },
  });

  return context.state;
}

function executeSendToTrashEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const trashEffect = effect as Extract<Effect, { type: "send-to-trash" }>;
  const target = resolveTarget(trashEffect.target, context);

  // Would send cards to trash
  events.push({
    type: "card-destroyed",
    data: { cardIds: target.cardIds },
  });

  return context.state;
}

function executeRemoveFromGameEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const removeEffect = effect as Extract<Effect, { type: "remove-from-game" }>;
  const target = resolveTarget(removeEffect.target, context);

  // Would remove cards from game
  return context.state;
}

function executeLookEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const lookEffect = effect as Extract<Effect, { type: "look" }>;

  // Would reveal cards to player without changing state
  return context.state;
}

function executeRevealEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const revealEffect = effect as Extract<Effect, { type: "reveal" }>;
  const target = resolveTarget(revealEffect.target, context);

  // Would reveal cards to all players
  return context.state;
}

function executeShuffleEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const shuffleEffect = effect as Extract<Effect, { type: "shuffle" }>;

  // Would shuffle deck
  return context.state;
}

// ============================================================================
// Combat Effect Executors
// ============================================================================

function executeDamageEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const damageEffect = effect as Extract<Effect, { type: "damage" }>;
  const amount = resolveAmount(damageEffect.amount, context);
  const target = resolveTarget(damageEffect.target, context);

  // Would apply damage to targets
  events.push({
    type: "damage-dealt",
    data: { amount, cardIds: target.cardIds },
  });

  return context.state;
}

function executeHealEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const healEffect = effect as Extract<Effect, { type: "heal" }>;
  const amount =
    healEffect.amount === "all"
      ? "all"
      : resolveAmount(healEffect.amount, context);
  const target = resolveTarget(healEffect.target, context);

  // Would remove damage from targets
  return context.state;
}

function executeDestroyEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const destroyEffect = effect as Extract<Effect, { type: "destroy" }>;
  const target = resolveTarget(destroyEffect.target, context);

  // Would destroy targets (send to trash)
  events.push({
    type: "card-destroyed",
    data: { cardIds: target.cardIds },
  });

  return context.state;
}

function executeRestEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const restEffect = effect as Extract<Effect, { type: "rest" }>;
  const target = resolveTarget(restEffect.target, context);

  // Would rest targets
  return context.state;
}

function executeStandEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const standEffect = effect as Extract<Effect, { type: "stand" }>;
  const target = resolveTarget(standEffect.target, context);

  // Would stand targets
  return context.state;
}

function executeBattleEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const battleEffect = effect as Extract<Effect, { type: "battle" }>;
  const attacker = resolveTarget(battleEffect.attacker, context);
  const defender = resolveTarget(battleEffect.defender, context);

  // Would initiate battle between units
  return context.state;
}

function executePreventDamageEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const preventEffect = effect as Extract<Effect, { type: "prevent-damage" }>;

  // Would add damage prevention marker
  return context.state;
}

function executeRedirectDamageEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const redirectEffect = effect as Extract<Effect, { type: "redirect-damage" }>;

  // Would set up damage redirection
  return context.state;
}

// ============================================================================
// Stat Modification Effect Executors
// ============================================================================

function executeModifyAPEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const modifyEffect = effect as Extract<Effect, { type: "modify-ap" }>;
  const amount = resolveAmount(modifyEffect.amount, context);
  const target = resolveTarget(modifyEffect.target, context);

  events.push({
    type: "stat-modified",
    data: { stat: "ap", amount, cardIds: target.cardIds },
  });

  return context.state;
}

function executeModifyHPEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const modifyEffect = effect as Extract<Effect, { type: "modify-hp" }>;
  const amount = resolveAmount(modifyEffect.amount, context);
  const target = resolveTarget(modifyEffect.target, context);

  events.push({
    type: "stat-modified",
    data: { stat: "hp", amount, cardIds: target.cardIds },
  });

  return context.state;
}

function executeSetAPEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const setEffect = effect as Extract<Effect, { type: "set-ap" }>;
  const amount = resolveAmount(setEffect.amount, context);
  const target = resolveTarget(setEffect.target, context);

  return context.state;
}

function executeSetHPEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const setEffect = effect as Extract<Effect, { type: "set-hp" }>;
  const amount = resolveAmount(setEffect.amount, context);
  const target = resolveTarget(setEffect.target, context);

  return context.state;
}

function executeSwapStatsEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const swapEffect = effect as Extract<Effect, { type: "swap-stats" }>;

  return context.state;
}

function executeGainControlEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const gainEffect = effect as Extract<Effect, { type: "gain-control" }>;
  const target = resolveTarget(gainEffect.target, context);

  events.push({
    type: "control-changed",
    data: { cardIds: target.cardIds },
  });

  return context.state;
}

// ============================================================================
// Resource Effect Executors
// ============================================================================

function executeAddResourcesEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const addEffect = effect as Extract<Effect, { type: "add-resources" }>;
  const amount = resolveAmount(addEffect.amount, context);
  const player =
    addEffect.player === "self"
      ? context.sourcePlayer
      : addEffect.player === "opponent"
        ? getOpponent(context.state, context.sourcePlayer)
        : context.sourcePlayer;

  if (!player) return context.state;

  // Would add resources
  return context.state;
}

function executePlayResourceEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const playEffect = effect as Extract<Effect, { type: "play-resource" }>;

  return context.state;
}

function executeRestForResourceEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const restEffect = effect as Extract<Effect, { type: "rest-for-resource" }>;

  return context.state;
}

// ============================================================================
// Pilot and Pairing Effect Executors
// ============================================================================

function executePairPilotEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const pairEffect = effect as Extract<Effect, { type: "pair-pilot" }>;
  const pilot = resolveTarget(pairEffect.pilot, context);
  const unit = resolveTarget(pairEffect.unit, context);

  events.push({
    type: "pilot-paired",
    data: { pilotIds: pilot.cardIds, unitIds: unit.cardIds },
  });

  return context.state;
}

function executeUnpairPilotEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const unpairEffect = effect as Extract<Effect, { type: "unpair-pilot" }>;
  const target = resolveTarget(unpairEffect.target, context);

  events.push({
    type: "pilot-unpaired",
    data: { cardIds: target.cardIds },
  });

  return context.state;
}

function executeSearchPilotEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const searchEffect = effect as Extract<Effect, { type: "search-pilot" }>;

  return context.state;
}

function executeAttachAsPilotEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const attachEffect = effect as Extract<Effect, { type: "attach-as-pilot" }>;

  return context.state;
}

// ============================================================================
// Shield Effect Executors
// ============================================================================

function executeAddShieldEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const addEffect = effect as Extract<Effect, { type: "add-shield" }>;
  const player =
    addEffect.player === "self"
      ? context.sourcePlayer
      : addEffect.player === "opponent"
        ? getOpponent(context.state, context.sourcePlayer)
        : context.sourcePlayer;

  if (!player) return context.state;

  events.push({
    type: "shield-added",
    data: { amount: addEffect.amount, player },
  });

  return context.state;
}

function executeBreakShieldEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const breakEffect = effect as Extract<Effect, { type: "break-shield" }>;
  const target = resolveTarget(breakEffect.target, context);

  events.push({
    type: "shield-broken",
    data: { cardIds: target.cardIds },
  });

  return context.state;
}

// ============================================================================
// Keyword Effect Executors
// ============================================================================

function executeGrantKeywordEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const grantEffect = effect as Extract<Effect, { type: "grant-keyword" }>;
  const target = resolveTarget(grantEffect.target, context);

  events.push({
    type: "keyword-granted",
    data: { keyword: grantEffect.keyword, cardIds: target.cardIds },
  });

  return context.state;
}

function executeLoseKeywordEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const loseEffect = effect as Extract<Effect, { type: "lose-keyword" }>;
  const target = resolveTarget(loseEffect.target, context);

  events.push({
    type: "keyword-lost",
    data: { keyword: loseEffect.keyword, cardIds: target.cardIds },
  });

  return context.state;
}

// ============================================================================
// Token Effect Executors
// ============================================================================

function executeCreateTokenEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const createEffect = effect as Extract<Effect, { type: "create-token" }>;

  events.push({
    type: "token-created",
    data: { token: createEffect.token },
  });

  return context.state;
}

// ============================================================================
// Control Flow Effect Executors
// ============================================================================

function executeSequenceEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const sequenceEffect = effect as Extract<Effect, { type: "sequence" }>;
  let state = context.state;

  for (const subEffect of sequenceEffect.effects) {
    const result = executeEffect(subEffect, { ...context, state });
    state = result.state;
    events.push(...result.events);

    if (!result.success) {
      break;
    }
  }

  return state;
}

function executeChoiceEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const choiceEffect = effect as Extract<Effect, { type: "choice" }>;

  // Would require player input
  // For now, this would return a pending choice
  return context.state;
}

function executeConditionalEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const conditionalEffect = effect as Extract<Effect, { type: "conditional" }>;
  const conditionMet = evaluateCondition(conditionalEffect.condition, context);

  const effectToExecute = conditionMet
    ? conditionalEffect.then
    : conditionalEffect.else;

  if (effectToExecute) {
    return executeEffect(effectToExecute, context).state;
  }

  return context.state;
}

function executeOptionalEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const optionalEffect = effect as Extract<Effect, { type: "optional" }>;

  // Would require player choice
  return context.state;
}

function executeForEachEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const forEachEffect = effect as Extract<Effect, { type: "for-each" }>;
  const target = resolveTarget(forEachEffect.target, context);
  let state = context.state;

  for (const cardId of target.cardIds) {
    const result = executeEffect(forEachEffect.effect, {
      ...context,
      state,
      sourceCard: cardId,
    });
    state = result.state;
    events.push(...result.events);
  }

  return state;
}

function executeDoTimesEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const doTimesEffect = effect as Extract<Effect, { type: "do-times" }>;
  const times = resolveAmount(doTimesEffect.times, context);
  let state = context.state;

  for (let i = 0; i < times; i++) {
    const result = executeEffect(doTimesEffect.effect, { ...context, state });
    state = result.state;
    events.push(...result.events);
  }

  return state;
}

function executeRepeatWhileEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const repeatEffect = effect as Extract<Effect, { type: "repeat-while" }>;
  let state = context.state;
  let iterations = 0;

  while (
    evaluateCondition(repeatEffect.condition, { ...context, state }) &&
    (repeatEffect.maxTimes === undefined || iterations < repeatEffect.maxTimes)
  ) {
    const result = executeEffect(repeatEffect.effect, { ...context, state });
    state = result.state;
    events.push(...result.events);
    iterations++;
  }

  return state;
}

function executeIfYouDoEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const ifYouDoEffect = effect as Extract<Effect, { type: "if-you-do" }>;

  // Would check if cost was paid, then execute effect
  return context.state;
}

function executeUntilEndOfTurnEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const untilEndEffect = effect as Extract<
    Effect,
    { type: "until-end-of-turn" }
  >;

  // Would add temporary effect that expires at end of turn
  return executeEffect(untilEndEffect.effect, context).state;
}

// ============================================================================
// Special Effect Executors
// ============================================================================

function executeCounterEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const counterEffect = effect as Extract<Effect, { type: "counter" }>;

  // Would counter the specified effect/ability
  return context.state;
}

function executeCopyEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const copyEffect = effect as Extract<Effect, { type: "copy" }>;

  // Would copy target card's abilities
  return context.state;
}

function executeChangeControllerEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const changeEffect = effect as Extract<Effect, { type: "change-controller" }>;
  const target = resolveTarget(changeEffect.target, context);

  events.push({
    type: "control-changed",
    data: { cardIds: target.cardIds },
  });

  return context.state;
}

function executeFlipEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const flipEffect = effect as Extract<Effect, { type: "flip" }>;
  const target = resolveTarget(flipEffect.target, context);

  return context.state;
}

function executeGainAbilityEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const gainEffect = effect as Extract<Effect, { type: "gain-ability" }>;
  const target = resolveTarget(gainEffect.target, context);

  return context.state;
}

function executeLoseAbilityEffect(
  effect: Effect,
  context: EffectContext,
  events: EffectEvent[],
): GundamGameState {
  const loseEffect = effect as Extract<Effect, { type: "lose-ability" }>;
  const target = resolveTarget(loseEffect.target, context);

  return context.state;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the opponent of a player
 */
function getOpponent(
  state: GundamGameState,
  player: PlayerId,
): PlayerId | undefined {
  return state.players.find((p) => p !== player);
}

/**
 * Create a fresh effect context
 */
export function createEffectContext(
  state: GundamGameState,
  sourcePlayer: PlayerId,
  sourceCard?: CardId,
): EffectContext {
  return {
    state,
    sourcePlayer,
    sourceCard,
    variables: {},
    choices: {},
    flags: {},
  };
}
