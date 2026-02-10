/**
 * Gundam Targeting System
 *
 * Handles target resolution and validation for Gundam effects.
 * Provides a DSL for defining which cards, players, or zones are affected by effects.
 */

import type { CardId, PlayerId, Zone } from "@tcg/core";
import type { GundamGameState } from "../types";
import type { EffectTarget, UnitSelector, ZoneSpec } from "./effect-types";

// Local type definition for resolved targets
type ResolvedTarget = {
  cardIds: CardId[];
  players: PlayerId[];
  zones: string[];
};

// ============================================================================
// Target Resolution
// ============================================================================

/**
 * Resolve a target specification to concrete targets
 */
export function resolveTarget(
  target: EffectTarget,
  state: GundamGameState,
  sourcePlayer: PlayerId,
  sourceCard?: CardId,
): ResolvedTarget {
  const opponent = state.players.find((p) => p !== sourcePlayer);

  // Handle simple string targets
  if (typeof target === "string") {
    return resolveStringTarget(
      target,
      state,
      sourcePlayer,
      opponent,
      sourceCard,
    );
  }

  // Handle selector-based targets
  if ("selector" in target) {
    return resolveSelectorTarget(
      target.selector,
      state,
      sourcePlayer,
      opponent,
    );
  }

  return { cardIds: [], players: [], zones: [] };
}

/**
 * Resolve string-based targets
 */
function resolveStringTarget(
  target: string,
  state: GundamGameState,
  sourcePlayer: PlayerId,
  opponent: PlayerId | undefined,
  sourceCard: CardId | undefined,
): ResolvedTarget {
  switch (target) {
    case "this":
    case "this-card":
    case "this-unit":
    case "this-base":
    case "this-pilot":
      return sourceCard
        ? { cardIds: [sourceCard], players: [], zones: [] }
        : { cardIds: [], players: [], zones: [] };

    case "self":
      return { cardIds: [], players: [sourcePlayer], zones: [] };

    case "opponent":
      return opponent
        ? { cardIds: [], players: [opponent], zones: [] }
        : { cardIds: [], players: [], zones: [] };

    case "each-player":
      return { cardIds: [], players: state.players, zones: [] };

    case "each-unit":
      return getAllUnits(state);

    case "each-opponent-unit":
      return opponent
        ? getUnitsInBattleArea(state, opponent)
        : { cardIds: [], players: [], zones: [] };

    case "each-friendly-unit":
      return getUnitsInBattleArea(state, sourcePlayer);

    case "chosen-unit":
    case "chosen-card":
      // These would be resolved from player input
      return { cardIds: [], players: [], zones: [] };

    default:
      return { cardIds: [], players: [], zones: [] };
  }
}

/**
 * Resolve selector-based targets
 */
function resolveSelectorTarget(
  selector: UnitSelector,
  state: GundamGameState,
  sourcePlayer: PlayerId,
  opponent: PlayerId | undefined,
): ResolvedTarget {
  // Determine which player(s) to search
  const playersToSearch =
    selector.controller === "self"
      ? [sourcePlayer]
      : selector.controller === "opponent" && opponent
        ? [opponent]
        : state.players;

  const results: CardId[] = [];

  // Search each player's battle area
  for (const player of playersToSearch) {
    const battleArea = state.zones.battleArea[player] as Zone | undefined;
    if (!battleArea?.cards) continue;

    for (const cardId of battleArea.cards) {
      if (matchesSelector(cardId, selector, state, player)) {
        results.push(cardId);
      }
    }
  }

  return { cardIds: results, players: [], zones: [] };
}

/**
 * Check if a card matches a selector
 */
function matchesSelector(
  cardId: CardId,
  selector: UnitSelector,
  state: GundamGameState,
  player: PlayerId,
): boolean {
  // Check position
  if (selector.position !== undefined) {
    const position = state.gundam.cardPositions[cardId];
    const isRested = position === "rested";
    if (selector.position === "active" && isRested) return false;
    if (selector.position === "rested" && !isRested) return false;
  }

  // Check damage
  if (selector.damaged !== undefined) {
    // Would need to check damage from card metadata
    // const meta = getCardMeta(state, cardId);
    // if (selector.damaged && meta.damage <= 0) return false;
    // if (!selector.damaged && meta.damage > 0) return false;
  }

  // Check keywords
  if (selector.hasKeyword !== undefined) {
    // Would need to check if card has keyword
    // const definition = getCardDefinition(state, cardId);
    // if (!definition.keywords.includes(selector.hasKeyword)) return false;
  }

  // Check level
  if (selector.minLevel !== undefined || selector.maxLevel !== undefined) {
    // Would need to get level from card definition
  }

  // Check cost
  if (selector.minCost !== undefined || selector.maxCost !== undefined) {
    // Would need to get cost from card definition
  }

  // Check card name
  if (selector.cardName !== undefined) {
    // Would need to get name from card definition
  }

  // Check card type
  if (selector.cardType !== undefined) {
    // Would need to get type from card definition
  }

  return true;
}

// ============================================================================
// Target Query Functions
// ============================================================================

/**
 * Get all units in play
 */
export function getAllUnits(state: GundamGameState): ResolvedTarget {
  const allUnits: CardId[] = [];
  for (const player of state.players) {
    const units = getUnitsInBattleArea(state, player);
    allUnits.push(...units.cardIds);
  }
  return { cardIds: allUnits, players: [], zones: [] };
}

/**
 * Get units in a player's battle area
 */
export function getUnitsInBattleArea(
  state: GundamGameState,
  player: PlayerId,
): ResolvedTarget {
  const battleArea = state.zones.battleArea[player] as Zone | undefined;
  return {
    cardIds: battleArea?.cards ?? [],
    players: [],
    zones: [],
  };
}

/**
 * Get cards in a player's hand
 */
export function getCardsInHand(
  state: GundamGameState,
  player: PlayerId,
): ResolvedTarget {
  const hand = state.zones.hand[player] as Zone | undefined;
  return {
    cardIds: hand?.cards ?? [],
    players: [],
    zones: [],
  };
}

/**
 * Get cards in a player's deck
 */
export function getCardsInDeck(
  state: GundamGameState,
  player: PlayerId,
): ResolvedTarget {
  const deck = state.zones.deck[player] as Zone | undefined;
  return {
    cardIds: deck?.cards ?? [],
    players: [],
    zones: [],
  };
}

/**
 * Get cards in a player's trash
 */
export function getCardsInTrash(
  state: GundamGameState,
  player: PlayerId,
): ResolvedTarget {
  const trash = state.zones.trash[player] as Zone | undefined;
  return {
    cardIds: trash?.cards ?? [],
    players: [],
    zones: [],
  };
}

/**
 * Get cards in a specific zone
 */
export function getCardsInZone(
  state: GundamGameState,
  player: PlayerId,
  zone: ZoneSpec,
): ResolvedTarget {
  const zoneData = state.zones[zone]?.[player] as Zone | undefined;
  return {
    cardIds: zoneData?.cards ?? [],
    players: [],
    zones: [],
  };
}

/**
 * Get a player's shields
 */
export function getShields(
  state: GundamGameState,
  player: PlayerId,
): ResolvedTarget {
  const shieldSection = state.zones.shieldSection[player] as Zone | undefined;
  return {
    cardIds: shieldSection?.cards ?? [],
    players: [],
    zones: [],
  };
}

/**
 * Get a player's resources
 */
export function getResources(
  state: GundamGameState,
  player: PlayerId,
): ResolvedTarget {
  const resourceArea = state.zones.resourceArea[player] as Zone | undefined;
  return {
    cardIds: resourceArea?.cards ?? [],
    players: [],
    zones: [],
  };
}

/**
 * Get the base in a player's base section
 */
export function getBase(
  state: GundamGameState,
  player: PlayerId,
): ResolvedTarget {
  const baseSection = state.zones.baseSection[player] as Zone | undefined;
  return {
    cardIds: baseSection?.cards ?? [],
    players: [],
    zones: [],
  };
}

// ============================================================================
// Target Validation
// ============================================================================

/**
 * Check if a target is valid
 */
export function isValidTarget(
  target: EffectTarget,
  state: GundamGameState,
  sourcePlayer: PlayerId,
  sourceCard?: CardId,
): boolean {
  const resolved = resolveTarget(target, state, sourcePlayer, sourceCard);
  return (
    resolved.cardIds.length > 0 ||
    resolved.players.length > 0 ||
    resolved.zones.length > 0
  );
}

/**
 * Check if a specific card ID is a valid target
 */
export function isValidTargetId(
  cardId: CardId,
  target: EffectTarget,
  state: GundamGameState,
  sourcePlayer: PlayerId,
  sourceCard?: CardId,
): boolean {
  const resolved = resolveTarget(target, state, sourcePlayer, sourceCard);
  return resolved.cardIds.includes(cardId);
}

// ============================================================================
// Target Filtering
// ============================================================================

/**
 * Filter targets by a predicate
 */
export function filterTargets(
  targets: ResolvedTarget,
  predicate: (cardId: CardId) => boolean,
): ResolvedTarget {
  return {
    ...targets,
    cardIds: targets.cardIds.filter(predicate),
  };
}

/**
 * Filter targets by position
 */
export function filterTargetsByPosition(
  state: GundamGameState,
  targets: ResolvedTarget,
  position: "active" | "rested",
): ResolvedTarget {
  return filterTargets(targets, (cardId) => {
    const cardPosition = state.gundam.cardPositions[cardId];
    return cardPosition === position;
  });
}

/**
 * Filter targets by controller
 */
export function filterTargetsByController(
  targets: ResolvedTarget,
  controller: PlayerId,
): ResolvedTarget {
  // This would need to check card ownership
  return targets;
}

/**
 * Limit number of targets
 */
export function limitTargets(
  targets: ResolvedTarget,
  max: number,
): ResolvedTarget {
  return {
    ...targets,
    cardIds: targets.cardIds.slice(0, max),
  };
}

/**
 * Get random targets
 */
export function getRandomTargets(
  targets: ResolvedTarget,
  count: number,
  seed?: number,
): ResolvedTarget {
  // Would use seeded RNG for deterministic results
  const shuffled = [...targets.cardIds].sort(() => Math.random() - 0.5);
  return {
    ...targets,
    cardIds: shuffled.slice(0, count),
  };
}

// ============================================================================
// Target Builders
// ============================================================================

/**
 * Create a target selector
 */
export function target(selector: UnitSelector): EffectTarget {
  return { selector };
}

/**
 * Create a "this" target
 */
export function thisTarget(): EffectTarget {
  return "this";
}

/**
 * Create a "self" target
 */
export function selfTarget(): EffectTarget {
  return "self";
}

/**
 * Create an "opponent" target
 */
export function opponentTarget(): EffectTarget {
  return "opponent";
}

/**
 * Create an "each unit" target
 */
export function eachUnitTarget(): EffectTarget {
  return "each-unit";
}

/**
 * Create an "each friendly unit" target
 */
export function eachFriendlyUnitTarget(): EffectTarget {
  return "each-friendly-unit";
}

/**
 * Create an "each opponent unit" target
 */
export function eachOpponentUnitTarget(): EffectTarget {
  return "each-opponent-unit";
}

/**
 * Create a "chosen unit" target
 */
export function chosenUnitTarget(): EffectTarget {
  return "chosen-unit";
}

/**
 * Create a "chosen card" target
 */
export function chosenCardTarget(): EffectTarget {
  return "chosen-card";
}
