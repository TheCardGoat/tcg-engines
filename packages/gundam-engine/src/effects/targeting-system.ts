/**
 * Gundam Card Game - Targeting System
 *
 * Pure helper functions for enumerating, validating, and filtering targets
 * based on zone, state, and property criteria.
 *
 * This implements the declarative targeting system using TargetingSpec and TargetFilter.
 *
 * @module effects/targeting-system
 */

import type { CardId, PlayerId } from "@tcg/core";
import type { GundamGameState } from "../types";
import type {
  BaseEffectCardDefinition,
  CardFilter,
  CardType,
  Color,
  CostFilter,
  LevelFilter,
  TargetCountRange,
  TargetFilter,
  TargetPropertyFilter,
  TargetStateFilter,
  TargetingSpec,
  ZoneType,
} from "../types/effects";

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * Context provided to targeting functions
 */
export interface TargetingContext {
  /** Player controlling the effect */
  readonly controllerId: PlayerId;

  /** Card that generated the effect */
  readonly sourceCardId: CardId;

  /** Optional card definitions for property filtering */
  readonly cardDefinitions?: Record<CardId, BaseEffectCardDefinition>;
}

// ============================================================================
// ZONE-BASED FILTERING HELPERS
// ============================================================================

/**
 * Gets all cards in a specific zone
 * @param state - Current game state
 * @param zone - Zone to retrieve cards from
 * @param playerId - Optional player ID for player-specific zones
 * @returns Array of CardIds in the zone
 */
export function getCardsInZone(
  state: GundamGameState,
  zone: ZoneType,
  playerId?: PlayerId,
): CardId[] {
  const zoneData = state.zones[zone];

  if (playerId) {
    // Get cards for specific player's zone
    const playerZone = zoneData[playerId];
    if (!playerZone) {
      return [];
    }
    return [...playerZone.cards];
  }

  // Get cards from all players' zones
  const allCards: CardId[] = [];
  for (const pid of state.players) {
    const playerZone = zoneData[pid];
    if (playerZone) {
      allCards.push(...playerZone.cards);
    }
  }
  return allCards;
}

/**
 * Filters a list of card IDs to only those in a specific zone
 * @param state - Current game state
 * @param cardIds - Card IDs to filter
 * @param zone - Zone to filter by
 * @param playerId - Optional player ID for player-specific zones
 * @returns Filtered array of CardIds
 */
export function filterCardsByZone(
  state: GundamGameState,
  cardIds: CardId[],
  zone: ZoneType,
  playerId?: PlayerId,
): CardId[] {
  const zoneCards = getCardsInZone(state, zone, playerId);
  const zoneCardSet = new Set(zoneCards);
  return cardIds.filter((id) => zoneCardSet.has(id));
}

/**
 * Checks if a card is in a specific zone
 * @param state - Current game state
 * @param cardId - Card to check
 * @param zone - Zone to check
 * @param playerId - Optional player ID for player-specific zones
 * @returns True if card is in the zone
 */
export function isCardInZone(
  state: GundamGameState,
  cardId: CardId,
  zone: ZoneType,
  playerId?: PlayerId,
): boolean {
  const zoneData = state.zones[zone];

  if (playerId) {
    const playerZone = zoneData[playerId];
    return playerZone?.cards.includes(cardId) ?? false;
  }

  for (const pid of state.players) {
    const playerZone = zoneData[pid];
    if (playerZone?.cards.includes(cardId)) {
      return true;
    }
  }
  return false;
}

// ============================================================================
// STATE-BASED FILTERING HELPERS
// ============================================================================

/**
 * Checks if a card is rested
 * @param state - Current game state
 * @param cardId - Card to check
 * @returns True if card is rested
 */
export function isCardRested(state: GundamGameState, cardId: CardId): boolean {
  const position = state.gundam.cardPositions[cardId];
  return position === "rested";
}

/**
 * Checks if a card is damaged (has damage counters)
 * @param state - Current game state
 * @param cardId - Card to check
 * @returns True if card has damage
 */
export function isCardDamaged(state: GundamGameState, cardId: CardId): boolean {
  const damage = state.gundam.cardDamage[cardId] ?? 0;
  return damage > 0;
}

/**
 * Gets the damage amount on a card
 * @param state - Current game state
 * @param cardId - Card to check
 * @returns Damage amount (0 if no damage)
 */
export function getCardDamage(state: GundamGameState, cardId: CardId): number {
  return state.gundam.cardDamage[cardId] ?? 0;
}

/**
 * Gets the owner of a card
 * @param state - Current game state
 * @param cardId - Card to find owner for
 * @returns PlayerId of owner, or undefined if card not found
 */
export function getCardOwner(state: GundamGameState, cardId: CardId): PlayerId | undefined {
  // Iterate through all zones to find the card
  for (const zoneType of Object.keys(state.zones) as ZoneType[]) {
    const zoneData = state.zones[zoneType];
    for (const playerId of state.players) {
      const playerZone = zoneData[playerId];
      if (playerZone?.cards.includes(cardId)) {
        // The zone config owner is the card owner
        return playerZone.config.owner;
      }
    }
  }
  return undefined;
}

/**
 * Checks if a card matches a state filter
 * @param state - Current game state
 * @param cardId - Card to check
 * @param stateFilter - State filter criteria
 * @returns True if card matches the state filter
 */
export function matchesStateFilter(
  state: GundamGameState,
  cardId: CardId,
  stateFilter: TargetStateFilter,
): boolean {
  // Check rested status
  if (stateFilter.rested !== undefined) {
    if (isCardRested(state, cardId) !== stateFilter.rested) {
      return false;
    }
  }

  // Check damaged status
  if (stateFilter.damaged !== undefined) {
    if (isCardDamaged(state, cardId) !== stateFilter.damaged) {
      return false;
    }
  }

  // Check damage threshold
  if (stateFilter.hasDamageAtLeast !== undefined) {
    const damage = getCardDamage(state, cardId);
    if (damage < stateFilter.hasDamageAtLeast) {
      return false;
    }
  }

  return true;
}

// ============================================================================
// PROPERTY-BASED FILTERING HELPERS
// ============================================================================

/**
 * Checks if a card definition matches a card type
 * @param cardDefinition - Card definition to check
 * @param cardType - Card type to match
 * @returns True if card matches the type
 */
export function matchesCardType(
  cardDefinition: BaseEffectCardDefinition,
  cardType: CardType,
): boolean {
  return cardDefinition.cardType === cardType;
}

/**
 * Checks if a card definition matches a color
 * @param cardDefinition - Card definition to check
 * @param color - Color to match
 * @returns True if card matches the color
 */
export function matchesColor(cardDefinition: BaseEffectCardDefinition, color: Color): boolean {
  return (cardDefinition as { color?: Color }).color === color;
}

/**
 * Checks if a card definition has all specified traits
 * @param cardDefinition - Card definition to check
 * @param traits - Traits to match (must have all)
 * @returns True if card has all traits
 */
export function hasTrait(cardDefinition: BaseEffectCardDefinition, traits: string[]): boolean {
  const cardTraits = (cardDefinition as { traits?: string[] }).traits ?? [];
  return traits.every((trait) => cardTraits.includes(trait));
}

/**
 * Checks if a card definition matches a cost filter
 * @param cardDefinition - Card definition to check
 * @param costFilter - Cost filter criteria
 * @returns True if card matches the cost filter
 */
export function matchesCostFilter(
  cardDefinition: BaseEffectCardDefinition,
  costFilter: CostFilter,
): boolean {
  const { cost } = cardDefinition;

  if (costFilter.exactly !== undefined) {
    return cost === costFilter.exactly;
  }

  if (costFilter.min !== undefined && cost < costFilter.min) {
    return false;
  }

  if (costFilter.max !== undefined && cost > costFilter.max) {
    return false;
  }

  return true;
}

/**
 * Checks if a card definition matches a level filter
 * @param cardDefinition - Card definition to check
 * @param levelFilter - Level filter criteria
 * @returns True if card matches the level filter
 */
export function matchesLevelFilter(
  cardDefinition: BaseEffectCardDefinition,
  levelFilter: LevelFilter,
): boolean {
  const level = cardDefinition.lv;

  if (levelFilter.exactly !== undefined) {
    return level === levelFilter.exactly;
  }

  if (levelFilter.min !== undefined && level < levelFilter.min) {
    return false;
  }

  if (levelFilter.max !== undefined && level > levelFilter.max) {
    return false;
  }

  return true;
}

/**
 * Checks if a card definition matches a property filter
 * @param cardDefinition - Card definition to check
 * @param propertyFilter - Property filter criteria
 * @returns True if card matches the property filter
 */
export function matchesPropertyFilter(
  cardDefinition: BaseEffectCardDefinition,
  propertyFilter: TargetPropertyFilter,
): boolean {
  // Check card type
  if (propertyFilter.cardType !== undefined) {
    if (!matchesCardType(cardDefinition, propertyFilter.cardType)) {
      return false;
    }
  }

  // Check color
  if (propertyFilter.color !== undefined) {
    if (!matchesColor(cardDefinition, propertyFilter.color)) {
      return false;
    }
  }

  // Check traits
  if (propertyFilter.trait !== undefined && propertyFilter.trait.length > 0) {
    if (!hasTrait(cardDefinition, propertyFilter.trait)) {
      return false;
    }
  }

  // Check cost
  if (propertyFilter.cost !== undefined) {
    if (!matchesCostFilter(cardDefinition, propertyFilter.cost)) {
      return false;
    }
  }

  // Check level
  if (propertyFilter.level !== undefined) {
    if (!matchesLevelFilter(cardDefinition, propertyFilter.level)) {
      return false;
    }
  }

  return true;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets all cards in the game state
 * @param state - Current game state
 * @returns Array of all CardIds
 */
export function getAllCardsInGame(state: GundamGameState): CardId[] {
  const allCards: CardId[] = [];

  for (const zoneType of Object.keys(state.zones) as ZoneType[]) {
    const zoneData = state.zones[zoneType];
    for (const playerId of state.players) {
      const playerZone = zoneData[playerId];
      if (playerZone) {
        allCards.push(...playerZone.cards);
      }
    }
  }

  return allCards;
}

/**
 * Gets all cards owned by a specific player
 * @param state - Current game state
 * @param playerId - Player to get cards for
 * @returns Array of CardIds owned by the player
 */
export function getCardsOwnedByPlayer(state: GundamGameState, playerId: PlayerId): CardId[] {
  const allCards: CardId[] = [];

  for (const zoneType of Object.keys(state.zones) as ZoneType[]) {
    const zoneData = state.zones[zoneType];
    const playerZone = zoneData[playerId];
    if (playerZone) {
      allCards.push(...playerZone.cards);
    }
  }

  return allCards;
}

/**
 * Gets the opponent player ID
 * @param state - Current game state
 * @param playerId - Player to get opponent for
 * @returns Opponent player ID, or undefined if not found
 */
export function getOpponentId(state: GundamGameState, playerId: PlayerId): PlayerId | undefined {
  return state.players.find((p) => p !== playerId);
}

// ============================================================================
// CORE FILTER MATCHING FUNCTION
// ============================================================================

/**
 * Checks if a card matches a target filter
 * @param state - Current game state
 * @param cardId - Card to check
 * @param filter - Filter criteria
 * @param context - Targeting context
 * @returns True if card matches the filter
 */
export function matchesFilter(
  state: GundamGameState,
  cardId: CardId,
  filter: TargetFilter,
  context: TargetingContext,
): boolean {
  // Check card type (unit, base, shield, card)
  // This requires card definition to properly validate
  if (filter.type !== "card") {
    const cardDef = context.cardDefinitions?.[cardId];
    if (!cardDef) {
      // Without card definition, we can't validate type
      // Return false for strict type checking
      return false;
    }

    const { cardType } = cardDef;
    switch (filter.type) {
      case "unit": {
        if (cardType !== "UNIT") {
          return false;
        }
        break;
      }
      case "base": {
        if (cardType !== "BASE") {
          return false;
        }
        break;
      }
      case "shield": {
        // Shields are typically units in shield section
        // This is a simplified check - actual implementation may vary
        if (!isCardInZone(state, cardId, "shieldSection")) {
          return false;
        }
        break;
      }
    }
  }

  // Check zone filter
  if (filter.zone !== undefined) {
    if (!isCardInZone(state, cardId, filter.zone)) {
      return false;
    }
  }

  // Check owner filter
  const cardOwner = getCardOwner(state, cardId);
  if (cardOwner === undefined) {
    return false; // Card not found in any zone
  }

  switch (filter.owner) {
    case "self": {
      if (cardOwner !== context.controllerId) {
        return false;
      }
      break;
    }
    case "opponent": {
      if (cardOwner === context.controllerId) {
        return false;
      }
      break;
    }
    case "any": {
      // Any owner is acceptable
      break;
    }
  }

  // Check state filter
  if (filter.state !== undefined) {
    if (!matchesStateFilter(state, cardId, filter.state)) {
      return false;
    }
  }

  // Check property filter (requires card definitions)
  if (filter.properties !== undefined) {
    const cardDef = context.cardDefinitions?.[cardId];
    if (!cardDef) {
      // Without card definition, we can't validate properties
      return false;
    }
    if (!matchesPropertyFilter(cardDef, filter.properties)) {
      return false;
    }
  }

  return true;
}

// ============================================================================
// TARGET ENUMERATION FUNCTION
// ============================================================================

/**
 * Enumerates all valid targets for a targeting specification
 * @param state - Current game state
 * @param targetingSpec - Targeting specification
 * @param context - Targeting context
 * @returns Array of valid target CardIds
 */
export function enumerateValidTargets(
  state: GundamGameState,
  targetingSpec: TargetingSpec,
  context: TargetingContext,
): CardId[] {
  const validTargets = new Set<CardId>();

  // Get all cards in the game as candidates
  const allCards = getAllCardsInGame(state);

  // For each filter, find matching cards (OR logic across filters)
  for (const filter of targetingSpec.validTargets) {
    for (const cardId of allCards) {
      if (matchesFilter(state, cardId, filter, context)) {
        validTargets.add(cardId);
      }
    }
  }

  // Convert Set to Array and return
  return [...validTargets];
}

// ============================================================================
// TARGET VALIDATION FUNCTION
// ============================================================================

/**
 * Validates that chosen targets meet the targeting specification
 * @param state - Current game state
 * @param targetingSpec - Targeting specification
 * @param chosenTargets - Targets chosen by player
 * @param context - Targeting context
 * @returns True if targets are valid
 */
export function validateTargets(
  state: GundamGameState,
  targetingSpec: TargetingSpec,
  chosenTargets: CardId[],
  context: TargetingContext,
): boolean {
  // Check count validation
  const { count } = targetingSpec;

  if (typeof count === "number") {
    // Exact count required
    if (chosenTargets.length !== count) {
      return false;
    }
  } else {
    // Range count
    const { min, max } = count;
    if (chosenTargets.length < min || chosenTargets.length > max) {
      return false;
    }
  }

  // Get valid targets
  const validTargets = enumerateValidTargets(state, targetingSpec, context);
  const validTargetSet = new Set(validTargets);

  // Check each chosen target is valid
  for (const targetId of chosenTargets) {
    if (!validTargetSet.has(targetId)) {
      return false;
    }
  }

  // Check for duplicates (if duplicates not allowed)
  const uniqueTargets = new Set(chosenTargets);
  if (uniqueTargets.size !== chosenTargets.length) {
    // Duplicate targets found - not allowed unless specified
    return false;
  }

  return true;
}

// ============================================================================
// CARD FILTER MATCHING (for search effects)
// ============================================================================

/**
 * Checks if a card matches a card filter (for search effects)
 * @param state - Current game state
 * @param cardId - Card to check
 * @param filter - Card filter criteria
 * @param cardDefinitions - Card definitions for property matching
 * @returns True if card matches the filter
 */
export function matchesCardFilter(
  state: GundamGameState,
  cardId: CardId,
  filter: CardFilter,
  cardDefinitions: Record<CardId, BaseEffectCardDefinition>,
): boolean {
  const cardDef = cardDefinitions[cardId];
  if (!cardDef) {
    return false;
  }

  // Check card type
  if (filter.cardType !== undefined) {
    if (!matchesCardType(cardDef, filter.cardType)) {
      return false;
    }
  }

  // Check color
  if (filter.color !== undefined) {
    if (!matchesColor(cardDef, filter.color)) {
      return false;
    }
  }

  // Check traits
  if (filter.trait !== undefined && filter.trait.length > 0) {
    if (!hasTrait(cardDef, filter.trait)) {
      return false;
    }
  }

  // Check name
  if (filter.name !== undefined) {
    if (cardDef.name !== filter.name) {
      return false;
    }
  }

  // Check cost
  if (filter.cost !== undefined) {
    if (!matchesCostFilter(cardDef, filter.cost)) {
      return false;
    }
  }

  // Check level
  if (filter.level !== undefined) {
    if (!matchesLevelFilter(cardDef, filter.level)) {
      return false;
    }
  }

  // Check keyword (card has specific keyword)
  if (filter.hasKeyword !== undefined) {
    const unitDef = cardDef as { keywordEffects?: string[] };
    const keywords = unitDef.keywordEffects ?? [];
    if (!keywords.includes(filter.hasKeyword)) {
      return false;
    }
  }

  return true;
}
