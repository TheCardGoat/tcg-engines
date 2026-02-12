/**
 * Gundam Card Game - Action Handlers
 *
 * This module provides pure handler functions for each EffectAction type.
 * Each handler accepts Immer draft state and mutates it directly.
 *
 * Handlers integrate with existing zone operations from zone-operations.ts
 * and maintain type safety through discriminated unions.
 *
 * @module effects/action-handlers
 */

import type { CardId, PlayerId, Zone } from "@tcg/core";
import { draw, getZoneSize, isCardInZone, moveCard, shuffle } from "@tcg/core";
import type {
  ActivateAction,
  CardFilter,
  CardType,
  Color,
  DamageAction,
  DestroyAction,
  DiscardAction,
  DrawAction,
  Effect,
  EffectAction,
  GrantKeywordAction,
  KeywordEffect,
  ModifyStatsAction,
  MoveCardAction,
  RestAction,
  SearchAction,
  TargetingSpec,
  ZoneType,
} from "@tcg/gundam-types/effects";
import type { CardPosition, GundamGameState } from "../types";
import type { ModifierId, TemporaryModifier } from "./effect-runtime";

// ============================================================================
// CARD DEFINITION REGISTRY
// ============================================================================

/**
 * Card definition interface (subset of properties needed for effects)
 *
 * This is a minimal interface for card properties used in effect resolution.
 * In production, this will be populated from actual card definitions.
 */
export interface CardDefinition {
  /** Unique card identifier */
  readonly id: string;
  /** Card type */
  readonly cardType: CardType;
  /** Color affinity */
  readonly color?: Color;
  /** Traits */
  readonly traits?: readonly string[];
  /** Card name */
  readonly name: string;
  /** Resource cost */
  readonly cost: number;
  /** Level (for units/commands/bases) */
  readonly level: number;
  /** HP (for units and bases) */
  readonly hp?: number;
  /** Keywords inherent to this card */
  readonly keywords?: readonly KeywordEffect[];
  /** Effects defined on this card */
  readonly effects?: readonly Effect[];
}

/**
 * Temporary card definition storage
 *
 * This is a placeholder for card definitions.
 * In T5, this will be replaced with actual card definition lookups.
 *
 * For now, we store card definitions here for testing and development.
 * The key is the card ID.
 */
const CARD_DEFINITIONS: Record<string, CardDefinition> = {};

/**
 * Registers a card definition
 *
 * This is used during game setup to register card definitions.
 * In production, this will be populated from card data.
 *
 * @param cardId - Card ID
 * @param definition - Card definition to register
 */
export function registerCardDefinition(
  cardId: CardId,
  definition: CardDefinition,
): void {
  CARD_DEFINITIONS[cardId] = definition;
}

/**
 * Gets a card definition by ID
 *
 * Looks up the card definition by card ID.
 * Returns undefined if not found.
 *
 * @param cardId - Card ID to look up
 * @returns Card definition or undefined
 */
export function getCardDefinition(cardId: CardId): CardDefinition | undefined {
  return CARD_DEFINITIONS[cardId];
}

/**
 * Clears all registered card definitions
 *
 * Used primarily for testing to reset state between tests.
 */
export function clearCardDefinitions(): void {
  for (const key of Object.keys(CARD_DEFINITIONS)) {
    delete CARD_DEFINITIONS[key];
  }
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * Action Context
 *
 * Provides contextual information for effect action execution.
 * All handlers receive this context along with the action and draft state.
 */
export interface ActionContext {
  /** Card that generated this effect */
  sourceCardId: CardId;

  /** Player controlling this effect */
  controllerId: PlayerId;

  /** Pre-resolved target card IDs (if applicable) */
  targets?: CardId[];
}

/**
 * Action Handler Type
 *
 * Pure function signature for all action handlers.
 * Handlers mutate the draft state directly and return void.
 */
export type ActionHandler = (
  draft: GundamGameState,
  action: EffectAction,
  context: ActionContext,
) => void;

// ============================================================================
// MODIFIER ID GENERATION
// ============================================================================

let modifierCounter = 0;

/**
 * Creates a unique modifier ID
 *
 * Generates unique identifiers for temporary modifier instances.
 * Uses a counter to ensure uniqueness across the game session.
 *
 * @param prefix - Optional prefix for the ID
 * @returns A unique modifier ID
 *
 * @example
 * ```typescript
 * const modId = createModifierId("ap-buff");
 * // Returns: "ap-buff-0"
 * ```
 */
export function createModifierId(prefix = "mod"): ModifierId {
  const id = `${prefix}-${modifierCounter++}` as ModifierId;
  return id;
}

/**
 * Resets the modifier counter (primarily for testing)
 *
 * @internal
 */
export function resetModifierCounter(): void {
  modifierCounter = 0;
}

// ============================================================================
// TARGET RESOLUTION HELPERS
// ============================================================================

/**
 * Gets the opponent player ID
 *
 * @param playerId - The current player
 * @param state - Current game state
 * @returns The opponent's player ID, or null if not found
 */
export function getOpponentPlayer(
  playerId: PlayerId,
  state: GundamGameState,
): PlayerId | null {
  const opponent = state.players.find((p) => p !== playerId);
  return opponent ?? null;
}

/**
 * Finds which zone contains a card
 *
 * Searches all zones to locate a specific card.
 * Returns the zone type and owner if found.
 *
 * @param cardId - Card to search for
 * @param state - Current game state
 * @returns Zone info if found, null otherwise
 */
export function findCardZone(
  cardId: CardId,
  state: GundamGameState,
): { zone: ZoneType; owner: PlayerId } | null {
  const zoneTypes: ZoneType[] = [
    "deck",
    "resourceDeck",
    "hand",
    "battleArea",
    "shieldSection",
    "baseSection",
    "resourceArea",
    "trash",
    "removal",
    "limbo",
  ];

  for (const player of state.players) {
    for (const zoneType of zoneTypes) {
      const zone = state.zones[zoneType][player];
      if (isCardInZone(zone, cardId)) {
        return { zone: zoneType, owner: player };
      }
    }
  }

  return null;
}

/**
 * Simple target resolution for T4
 *
 * Basic target resolution that handles simple targeting specs.
 * For T4, this is a simplified version. Full targeting system comes in T5.
 *
 * @param spec - Targeting specification
 * @param context - Action context
 * @param state - Current game state
 * @returns Array of resolved target card IDs
 */
export function resolveSimpleTarget(
  spec: TargetingSpec,
  context: ActionContext,
  state: GundamGameState,
): CardId[] {
  // For T4, if context already has targets, use them
  if (context.targets && context.targets.length > 0) {
    const count = typeof spec.count === "number" ? spec.count : spec.count.min;
    return context.targets.slice(0, count);
  }

  // Otherwise, return empty array (full resolution in T5)
  return [];
}

/**
 * Resolves player reference from context
 *
 * @param playerRef - "self", "opponent", or direct player ID
 * @param context - Action context
 * @param state - Current game state
 * @returns Resolved player ID
 */
export function resolvePlayerRef(
  playerRef: "self" | "opponent" | PlayerId,
  context: ActionContext,
  state: GundamGameState,
): PlayerId | null {
  if (playerRef === "self") {
    return context.controllerId;
  }
  if (playerRef === "opponent") {
    return getOpponentPlayer(context.controllerId, state);
  }
  return playerRef;
}

// ============================================================================
// DAMAGE TRACKING HELPERS
// ============================================================================

/**
 * Gets the current damage on a card
 *
 * For units in battle area, bases in base section, and shields in shield section.
 *
 * @param cardId - Card to check
 * @param state - Current game state
 * @returns Current damage count
 */
export function getCardDamage(cardId: CardId, state: GundamGameState): number {
  return state.gundam.cardDamage?.[cardId] ?? 0;
}

/**
 * Sets damage on a card
 *
 * @param draft - Immer draft state
 * @param cardId - Card to damage
 * @param amount - Damage amount to set
 */
export function setCardDamage(
  draft: GundamGameState,
  cardId: CardId,
  amount: number,
): void {
  // Ensure cardDamage object exists
  if (!draft.gundam.cardDamage) {
    draft.gundam.cardDamage = {};
  }

  if (amount <= 0) {
    // Remove damage tracking if damage is 0 or less
    delete draft.gundam.cardDamage[cardId];
  } else {
    draft.gundam.cardDamage[cardId] = amount;
  }
}

/**
 * Gets the HP of a card from its definition
 *
 * @param cardId - Card to check
 * @returns HP value or undefined if card not found
 */
export function getCardHP(cardId: CardId): number | undefined {
  const definition = getCardDefinition(cardId);
  return definition?.hp;
}

/**
 * Checks if a card has lethal damage (damage >= HP)
 *
 * @param cardId - Card to check
 * @param state - Current game state
 * @returns True if damage >= HP, false otherwise
 */
export function hasLethalDamage(
  cardId: CardId,
  state: GundamGameState,
): boolean {
  const hp = getCardHP(cardId);
  if (hp === undefined) {
    return false; // No HP defined, cannot have lethal damage
  }
  const damage = getCardDamage(cardId, state);
  return damage >= hp;
}

// ============================================================================
// HANDLER IMPLEMENTATIONS
// ============================================================================

/**
 * DRAW Action Handler
 *
 * Draws the specified number of cards from deck to hand.
 * Handles empty deck case by drawing as many cards as possible.
 *
 * @param draft - Immer draft state to mutate
 * @param action - DRAW action
 * @param context - Action context
 *
 * @example
 * ```typescript
 * handleDrawAction(draft, { type: "DRAW", count: 2, player: "self" }, context);
 * ```
 */
export function handleDrawAction(
  draft: GundamGameState,
  action: DrawAction,
  context: ActionContext,
): void {
  const targetPlayer = resolvePlayerRef(action.player, context, draft);
  if (!targetPlayer) {
    return; // Invalid player reference
  }

  const deck = draft.zones.deck[targetPlayer];
  const hand = draft.zones.hand[targetPlayer];

  const { fromZone: newDeck, toZone: newHand } = draw(deck, hand, action.count);

  draft.zones.deck[targetPlayer] = newDeck;
  draft.zones.hand[targetPlayer] = newHand;

  // Note: Empty deck handling (game loss condition) will be added in T5
  // when we implement the full game loop
}

/**
 * DAMAGE Action Handler
 *
 * Deals effect damage to a target. Damage is tracked with counters.
 * If damage >= HP, the card is destroyed.
 * Shields are moved to trash when damaged.
 *
 * @param draft - Immer draft state to mutate
 * @param action - DAMAGE action
 * @param context - Action context
 */
export function handleDamageAction(
  draft: GundamGameState,
  action: DamageAction,
  context: ActionContext,
): void {
  // Create a default targeting spec if targetSelector is not provided
  // Use the number of pre-resolved targets if available, otherwise default to 1
  const resolvedCount = context.targets?.length ?? 1;
  const defaultTargetSpec: TargetingSpec = {
    count: resolvedCount,
    validTargets: [{ type: action.target, owner: "opponent" }],
    chooser: "controller",
    timing: "on_resolution",
  };

  // Handle the case where targetSelector might be a TargetFilter
  let targetingSpec: TargetingSpec;
  if (action.targetSelector) {
    // If targetSelector is provided, wrap it in a TargetingSpec
    targetingSpec = {
      count: resolvedCount,
      validTargets: [action.targetSelector],
      chooser: "controller",
      timing: "on_resolution",
    };
  } else {
    targetingSpec = defaultTargetSpec;
  }

  const targets = resolveSimpleTarget(targetingSpec, context, draft);

  if (targets.length === 0) {
    return; // No valid targets
  }

  for (const targetId of targets) {
    const currentDamage = getCardDamage(targetId, draft);
    const newDamage = currentDamage + action.amount;

    setCardDamage(draft, targetId, newDamage);

    // Post-damage effects: handle zone-specific behavior
    const zoneInfo = findCardZone(targetId, draft);

    if (!zoneInfo) {
      continue; // Card not found in any zone
    }

    const { zone, owner } = zoneInfo;

    // Shields are destroyed by any damage and moved to trash
    if (zone === "shieldSection") {
      const sourceZone = draft.zones.shieldSection[owner];
      const trashZone = draft.zones.trash[owner];

      // Move card to trash
      const { fromZone: newSource, toZone: newTrash } = moveCard(
        sourceZone,
        trashZone,
        targetId,
      );

      draft.zones.shieldSection[owner] = newSource;
      draft.zones.trash[owner] = newTrash;

      // Clear damage counter
      setCardDamage(draft, targetId, 0);
    }
    // Units and bases check for lethal damage
    else if (zone === "battleArea" || zone === "baseSection") {
      if (hasLethalDamage(targetId, draft)) {
        // Destroy the card by moving to trash
        const sourceZone = draft.zones[zone][owner];
        const trashZone = draft.zones.trash[owner];

        const { fromZone: newSource, toZone: newTrash } = moveCard(
          sourceZone,
          trashZone,
          targetId,
        );

        draft.zones[zone][owner] = newSource;
        draft.zones.trash[owner] = newTrash;

        // Clear damage counter
        setCardDamage(draft, targetId, 0);

        // Remove temporary modifiers
        delete draft.gundam.temporaryModifiers[targetId];

        // Clear card position if applicable
        if (zone === "battleArea" || zone === "baseSection") {
          delete draft.gundam.cardPositions[targetId];
        }
      }
    }
  }
}

/**
 * REST Action Handler
 *
 * Changes a card's orientation from active to rested.
 *
 * @param draft - Immer draft state to mutate
 * @param action - REST action
 * @param context - Action context
 */
export function handleRestAction(
  draft: GundamGameState,
  action: RestAction,
  context: ActionContext,
): void {
  const targets = resolveSimpleTarget(action.target, context, draft);

  for (const targetId of targets) {
    // Check if card is in a position-supporting zone
    const zoneInfo = findCardZone(targetId, draft);
    if (
      !(
        zoneInfo &&
        ["battleArea", "resourceArea", "baseSection"].includes(zoneInfo.zone)
      )
    ) {
      continue; // Card not in a position-supporting zone
    }

    // Set to rested
    draft.gundam.cardPositions[targetId] = "rested";
  }
}

/**
 * ACTIVATE Action Handler
 *
 * Changes a card's orientation from rested to active.
 *
 * @param draft - Immer draft state to mutate
 * @param action - ACTIVATE action
 * @param context - Action context
 */
export function handleActivateAction(
  draft: GundamGameState,
  action: ActivateAction,
  context: ActionContext,
): void {
  const targets = resolveSimpleTarget(action.target, context, draft);

  for (const targetId of targets) {
    // Check if card is in a position-supporting zone
    const zoneInfo = findCardZone(targetId, draft);
    if (
      !(
        zoneInfo &&
        ["battleArea", "resourceArea", "baseSection"].includes(zoneInfo.zone)
      )
    ) {
      continue; // Card not in a position-supporting zone
    }

    // Set to active
    draft.gundam.cardPositions[targetId] = "active";
  }
}

/**
 * MOVE_CARD Action Handler
 *
 * Moves a card from one zone to another.
 * Clears card position when moving out of position-supporting zones.
 *
 * @param draft - Immer draft state to mutate
 * @param action - MOVE_CARD action
 * @param context - Action context
 */
export function handleMoveCardAction(
  draft: GundamGameState,
  action: MoveCardAction,
  context: ActionContext,
): void {
  const targets = resolveSimpleTarget(action.target, context, draft);

  if (targets.length === 0) {
    return;
  }

  const cardId = targets[0]!;
  // Determine owner
  const owner = action.owner
    ? resolvePlayerRef(action.owner, context, draft)
    : context.controllerId;

  if (!owner) {
    return; // Cannot determine owner
  }

  // Get source zone
  const sourceZone = draft.zones[action.from][owner];
  // Get destination zone
  const destZone = draft.zones[action.to][owner];

  // Verify card is in source zone
  if (!isCardInZone(sourceZone, cardId)) {
    return; // Card not in source zone
  }

  // Move the card
  const { fromZone: newSource, toZone: newDest } = moveCard(
    sourceZone,
    destZone,
    cardId,
  );

  draft.zones[action.from][owner] = newSource;
  draft.zones[action.to][owner] = newDest;

  // Clear card position if moving out of position-supporting zone
  const positionSupportingZones: ZoneType[] = [
    "battleArea",
    "resourceArea",
    "baseSection",
  ];

  if (
    positionSupportingZones.includes(action.from) &&
    !positionSupportingZones.includes(action.to)
  ) {
    delete draft.gundam.cardPositions[cardId];
  }
}

/**
 * DESTROY Action Handler
 *
 * Destroys a card, moving it to the trash.
 * Clears damage counters, temporary modifiers, and card position.
 * Detects and enqueues 【Destroyed】 triggered effects before destruction.
 *
 * @param draft - Immer draft state to mutate
 * @param action - DESTROY action
 * @param context - Action context
 */
export function handleDestroyAction(
  draft: GundamGameState,
  action: DestroyAction,
  context: ActionContext,
): void {
  const targets = resolveSimpleTarget(action.target, context, draft);

  // Track destroyed cards with their owners for trigger detection
  const destroyedCards: Array<{ cardId: CardId; owner: PlayerId }> = [];

  // First pass: find all cards and their zones, detect triggers BEFORE destruction
  // This ensures trigger detection sees the cards in their original zones
  for (const cardId of targets) {
    const zoneInfo = findCardZone(cardId, draft);
    if (!zoneInfo) {
      continue; // Card not found in any zone
    }
    destroyedCards.push({ cardId, owner: zoneInfo.owner });
  }

  // Detect and enqueue 【Destroyed】 triggered effects BEFORE moving cards
  // This is important because trigger detection scans the battle area
  // Import locally to avoid circular dependencies
  const {
    detectAndEnqueueDestroyedTriggers,
  } = require("./trigger-integration");
  for (const { cardId, owner } of destroyedCards) {
    detectAndEnqueueDestroyedTriggers(draft, cardId, owner);
  }

  // Second pass: actually move cards to trash and clean up
  for (const { cardId } of destroyedCards) {
    // Find which zone contains the card (may have changed, but unlikely)
    const zoneInfo = findCardZone(cardId, draft);
    if (!zoneInfo) {
      continue; // Card not found in any zone
    }

    const { zone: fromZone, owner } = zoneInfo;

    // Get trash zone for card owner
    const trashZone = draft.zones.trash[owner];
    const sourceZone = draft.zones[fromZone][owner];

    // Move card to trash
    const { fromZone: newSource, toZone: newTrash } = moveCard(
      sourceZone,
      trashZone,
      cardId,
    );

    draft.zones[fromZone][owner] = newSource;
    draft.zones.trash[owner] = newTrash;

    // Clear damage counter
    setCardDamage(draft, cardId, 0);

    // Remove temporary modifiers
    delete draft.gundam.temporaryModifiers[cardId];

    // Clear card position
    delete draft.gundam.cardPositions[cardId];
  }
}

/**
 * DISCARD Action Handler
 *
 * Discards cards from hand to trash.
 * Supports random discard and chosen discard.
 *
 * @param draft - Immer draft state to mutate
 * @param action - DISCARD action
 * @param context - Action context
 */
export function handleDiscardAction(
  draft: GundamGameState,
  action: DiscardAction,
  context: ActionContext,
): void {
  const targetPlayer = resolvePlayerRef(action.player, context, draft);
  if (!targetPlayer) {
    return;
  }

  const hand = draft.zones.hand[targetPlayer];
  const trash = draft.zones.trash[targetPlayer];

  // Determine which cards to discard
  let cardsToDiscard: CardId[] = [];

  if (action.random && action.random === true) {
    // Random discard - select random cards
    const handSize = getZoneSize(hand);
    const toDiscard = Math.min(action.count, handSize);

    // Simple random selection for T4 (deterministic RNG for T5)
    const handCards = [...hand.cards];
    for (let i = 0; i < toDiscard; i++) {
      const randomIndex = Math.floor(Math.random() * handCards.length);
      const card = handCards.splice(randomIndex, 1)[0];
      if (card) {
        cardsToDiscard.push(card);
      }
    }
  } else {
    // Choice-based discard - use first N cards from context targets
    if (context.targets && context.targets.length > 0) {
      cardsToDiscard = context.targets.slice(0, action.count);
    } else {
      // No targets provided, discard from top of hand
      const toDiscard = Math.min(action.count, hand.cards.length);
      cardsToDiscard = hand.cards.slice(0, toDiscard);
    }
  }

  // Move each card to trash
  let currentHand = hand;
  let currentTrash = trash;

  for (const cardId of cardsToDiscard) {
    if (!isCardInZone(currentHand, cardId)) {
      continue; // Card no longer in hand
    }

    const { fromZone: newHand, toZone: newTrash } = moveCard(
      currentHand,
      currentTrash,
      cardId,
    );

    currentHand = newHand;
    currentTrash = newTrash;
  }

  draft.zones.hand[targetPlayer] = currentHand;
  draft.zones.trash[targetPlayer] = currentTrash;
}

/**
 * MODIFY_STATS Action Handler
 *
 * Temporarily or permanently modifies a unit's AP and/or HP.
 * Creates a temporary modifier that expires at the specified duration.
 *
 * @param draft - Immer draft state to mutate
 * @param action - MODIFY_STATS action
 * @param context - Action context
 */
export function handleModifyStatsAction(
  draft: GundamGameState,
  action: ModifyStatsAction,
  context: ActionContext,
): void {
  const targets = resolveSimpleTarget(action.target, context, draft);

  if (targets.length === 0) {
    return;
  }

  for (const cardId of targets) {
    // Create modifier based on duration
    const baseModifier = {
      id: createModifierId("stat-mod"),
      sourceId: context.sourceCardId,
      apModifier: action.apModifier,
      hpModifier: action.hpModifier,
    };

    let modifier: TemporaryModifier;

    switch (action.duration) {
      case "this_turn":
        modifier = {
          ...baseModifier,
          duration: "end_of_turn",
        };
        break;
      case "end_of_combat":
        modifier = {
          ...baseModifier,
          duration: "end_of_combat",
        };
        break;
      case "permanent":
        modifier = {
          ...baseModifier,
          duration: "permanent",
        };
        break;
    }

    // Initialize modifiers array if needed
    if (!draft.gundam.temporaryModifiers[cardId]) {
      draft.gundam.temporaryModifiers[cardId] = [];
    }

    draft.gundam.temporaryModifiers[cardId].push(modifier);
  }
}

/**
 * GRANT_KEYWORD Action Handler
 *
 * Grants a keyword to a target for a specified duration.
 * Creates a temporary modifier with the granted keyword.
 *
 * @param draft - Immer draft state to mutate
 * @param action - GRANT_KEYWORD action
 * @param context - Action context
 */
export function handleGrantKeywordAction(
  draft: GundamGameState,
  action: GrantKeywordAction,
  context: ActionContext,
): void {
  const targets = resolveSimpleTarget(action.target, context, draft);

  if (targets.length === 0) {
    return;
  }

  for (const cardId of targets) {
    // Create modifier based on duration
    const baseModifier = {
      id: createModifierId("keyword-grant"),
      sourceId: context.sourceCardId,
      grantedKeywords: [action.keyword],
    };

    let modifier: TemporaryModifier;

    if (action.duration === "while_condition") {
      modifier = {
        ...baseModifier,
        duration: "while_condition",
        condition: action.condition ?? "",
      };
    } else if (action.duration === "this_turn") {
      modifier = {
        ...baseModifier,
        duration: "end_of_turn",
      };
    } else {
      // permanent
      modifier = {
        ...baseModifier,
        duration: "permanent",
      };
    }

    // Initialize modifiers array if needed
    if (!draft.gundam.temporaryModifiers[cardId]) {
      draft.gundam.temporaryModifiers[cardId] = [];
    }

    draft.gundam.temporaryModifiers[cardId].push(modifier);
  }
}

/**
 * Card filter predicate
 *
 * Tests if a card matches the given filter criteria.
 * Uses card definitions to check properties.
 *
 * @param cardId - Card ID to test
 * @param filter - Filter criteria
 * @returns True if card matches filter, false otherwise
 */
function cardMatchesFilter(cardId: CardId, filter: CardFilter): boolean {
  const definition = getCardDefinition(cardId);

  // If no definition found, card doesn't match any property-based filter
  if (!definition) {
    // Empty filter matches all cards
    return Object.keys(filter).length === 0;
  }

  // Check card type
  if (
    filter.cardType !== undefined &&
    definition.cardType !== filter.cardType
  ) {
    return false;
  }

  // Check color
  if (filter.color !== undefined && definition.color !== filter.color) {
    return false;
  }

  // Check traits - all specified traits must be present
  if (filter.trait !== undefined && filter.trait.length > 0) {
    const cardTraits = definition.traits ?? [];
    const hasAllTraits = filter.trait.every((trait: string) =>
      cardTraits.includes(trait),
    );
    if (!hasAllTraits) {
      return false;
    }
  }

  // Check name (exact match or contains)
  if (filter.name !== undefined) {
    if (
      filter.name !== definition.name &&
      !definition.name.includes(filter.name)
    ) {
      return false;
    }
  }

  // Check cost range
  if (filter.cost !== undefined) {
    const cost = definition.cost;
    if (filter.cost.exactly !== undefined && cost !== filter.cost.exactly) {
      return false;
    }
    if (filter.cost.min !== undefined && cost < filter.cost.min) {
      return false;
    }
    if (filter.cost.max !== undefined && cost > filter.cost.max) {
      return false;
    }
  }

  // Check level range
  if (filter.level !== undefined) {
    const level = definition.level;
    if (filter.level.exactly !== undefined && level !== filter.level.exactly) {
      return false;
    }
    if (filter.level.min !== undefined && level < filter.level.min) {
      return false;
    }
    if (filter.level.max !== undefined && level > filter.level.max) {
      return false;
    }
  }

  // Check keyword presence
  if (filter.hasKeyword !== undefined) {
    const cardKeywords = definition.keywords ?? [];
    if (!cardKeywords.includes(filter.hasKeyword)) {
      return false;
    }
  }

  return true;
}

/**
 * SEARCH Action Handler
 *
 * Searches a zone for cards matching a filter and moves them to a destination.
 * Uses deterministic shuffling and tracks revealed cards.
 *
 * @param draft - Immer draft state to mutate
 * @param action - SEARCH action
 * @param context - Action context
 */
export function handleSearchAction(
  draft: GundamGameState,
  action: SearchAction,
  context: ActionContext,
): void {
  // Determine which zone to search (default to deck)
  const sourceZoneType = action.sourceZone ?? "deck";
  const searchZone = draft.zones[sourceZoneType][context.controllerId];
  const destZoneType = action.destination;
  const destZone = draft.zones[destZoneType][context.controllerId];

  // Apply filter to find matching cards using card definitions
  const matchingCards = searchZone.cards.filter((cardId) =>
    cardMatchesFilter(cardId, action.filter),
  );

  // Select up to count cards
  const toMove = matchingCards.slice(0, action.count);

  // Track revealed cards if reveal is true
  if (action.reveal && toMove.length > 0) {
    // Ensure revealedCards array exists
    if (!draft.gundam.revealedCards) {
      draft.gundam.revealedCards = [];
    }
    // Add revealed cards to tracking
    draft.gundam.revealedCards.push(...toMove);
  }

  // Move found cards to destination
  let currentSource = searchZone;
  let currentDest = destZone;

  for (const cardId of toMove) {
    const { fromZone: newSource, toZone: newDest } = moveCard(
      currentSource,
      currentDest,
      cardId,
    );

    currentSource = newSource;
    currentDest = newDest;
  }

  draft.zones[sourceZoneType][context.controllerId] = currentSource;
  draft.zones[destZoneType][context.controllerId] = currentDest;

  // Shuffle after search if specified
  if (action.shuffleAfter) {
    // Use deterministic seed based on source card ID and effect instance
    // This ensures consistent shuffling for replays
    const seed = `search-${context.sourceCardId}-${draft.gundam.effectStack.nextInstanceId}`;
    draft.zones[sourceZoneType][context.controllerId] = shuffle(
      currentSource,
      seed,
    );
  }
}

// ============================================================================
// ACTION DISPATCHER
// ============================================================================

/**
 * Action Dispatcher
 *
 * Main dispatcher function that routes actions to their appropriate handlers.
 * Uses exhaustive switch statement for type safety.
 *
 * @param draft - Immer draft state to mutate
 * @param action - Effect action to execute
 * @param context - Action context
 *
 * @example
 * ```typescript
 * executeAction(draft, { type: "DRAW", count: 2, player: "self" }, context);
 * ```
 */
export function executeAction(
  draft: GundamGameState,
  action: EffectAction,
  context: ActionContext,
): void {
  switch (action.type) {
    case "DRAW":
      handleDrawAction(draft, action, context);
      break;
    case "DAMAGE":
      handleDamageAction(draft, action, context);
      break;
    case "REST":
      handleRestAction(draft, action, context);
      break;
    case "ACTIVATE":
      handleActivateAction(draft, action, context);
      break;
    case "MOVE_CARD":
      handleMoveCardAction(draft, action, context);
      break;
    case "DESTROY":
      handleDestroyAction(draft, action, context);
      break;
    case "DISCARD":
      handleDiscardAction(draft, action, context);
      break;
    case "MODIFY_STATS":
      handleModifyStatsAction(draft, action, context);
      break;
    case "GRANT_KEYWORD":
      handleGrantKeywordAction(draft, action, context);
      break;
    case "SEARCH":
      handleSearchAction(draft, action, context);
      break;
    default: {
      // TypeScript exhaustiveness check ensures all cases are handled
      const _exhaustiveCheck: never = action;
      throw new Error(`Unknown action type: ${_exhaustiveCheck}`);
    }
  }
}

// ============================================================================
// BATCH ACTION EXECUTION
// ============================================================================

/**
 * Executes multiple actions in sequence
 *
 * @param draft - Immer draft state to mutate
 * @param actions - Array of actions to execute
 * @param context - Action context (shared across all actions)
 *
 * @example
 * ```typescript
 * executeActions(draft, [
 *   { type: "DRAW", count: 1, player: "self" },
 *   { type: "DAMAGE", amount: 2, target: "unit", damageType: "effect" }
 * ], context);
 * ```
 */
export function executeActions(
  draft: GundamGameState,
  actions: EffectAction[],
  context: ActionContext,
): void {
  for (const action of actions) {
    executeAction(draft, action, context);
  }
}
