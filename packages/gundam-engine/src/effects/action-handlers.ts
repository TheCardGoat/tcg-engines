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

import type { CardId, PlayerId } from "@tcg/core";
import { draw, getZoneSize, isCardInZone, moveCard, shuffle } from "@tcg/core";
import type { TemporaryModifier } from "@tcg/gundam-types";
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
import type { Draft } from "immer";
import type { CardPosition, GundamGameState } from "../types";
import type { ModifierId } from "./effect-runtime";

// ============================================================================
// STATE ACCESS HELPERS
// ============================================================================

/**
 * Helper to get a zone by type and player
 */
function getZone(
  state: GundamGameState | Draft<GundamGameState>,
  zoneType: string,
  player: PlayerId,
) {
  const zoneId = `${zoneType}-${player}`;
  return state.internal.zones[zoneId];
}

/**
 * Helper to get cardIds from a zone
 */
function getZoneCardIds(
  state: GundamGameState | Draft<GundamGameState>,
  zoneType: string,
  player: PlayerId,
): CardId[] {
  const zone = getZone(state, zoneType, player);
  return zone?.cardIds ?? [];
}

/**
 * Helper to get card meta (with damage, rested status, etc.)
 */
function getCardMeta(
  state: GundamGameState | Draft<GundamGameState>,
  cardId: CardId,
) {
  return state.internal.cardMetas[cardId];
}

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
  const opponent = state.external.playerIds.find((p) => p !== playerId);
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

  for (const player of state.external.playerIds) {
    for (const zoneType of zoneTypes) {
      const zoneId = `${zoneType}-${player}`;
      const zone = state.internal.zones[zoneId];
      if (zone?.cardIds?.includes(cardId)) {
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
  return state.internal.cardMetas[cardId]?.damage ?? 0;
}

/**
 * Sets damage on a card
 *
 * @param draft - Immer draft state
 * @param cardId - Card to damage
 * @param amount - Damage amount to set
 */
export function setCardDamage(
  draft: Draft<GundamGameState>,
  cardId: CardId,
  amount: number,
): void {
  // Ensure cardMeta exists for this card
  if (!draft.internal.cardMetas[cardId]) {
    draft.internal.cardMetas[cardId] = {
      isRested: false,
      damage: 0,
      playedThisTurn: false,
    };
  }

  draft.internal.cardMetas[cardId].damage = amount;
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
  draft: Draft<GundamGameState>,
  action: DrawAction,
  context: ActionContext,
): void {
  const targetPlayer = resolvePlayerRef(action.player, context, draft);
  if (!targetPlayer) {
    return; // Invalid player reference
  }

  const deckZoneId = `deck-${targetPlayer}`;
  const handZoneId = `hand-${targetPlayer}`;

  const deckZone = draft.internal.zones[deckZoneId];
  const handZone = draft.internal.zones[handZoneId];

  if (!(deckZone && handZone)) {
    return; // Zones don't exist
  }

  // Draw cards from deck to hand
  const cardsToDraw = Math.min(action.count, deckZone.cardIds.length);
  const drawnCards = deckZone.cardIds.splice(0, cardsToDraw);
  handZone.cardIds.push(...drawnCards);

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
      const sourceZoneId = `shieldSection-${owner}`;
      const trashZoneId = `trash-${owner}`;
      const sourceZone = draft.internal.zones[sourceZoneId];
      const trashZone = draft.internal.zones[trashZoneId];

      if (sourceZone && trashZone) {
        // Move card to trash
        const cardIndex = sourceZone.cardIds.indexOf(targetId);
        if (cardIndex !== -1) {
          sourceZone.cardIds.splice(cardIndex, 1);
          trashZone.cardIds.push(targetId);
        }

        // Clear damage counter
        setCardDamage(draft, targetId, 0);
      }
    }
    // Units and bases check for lethal damage
    else if (zone === "battleArea" || zone === "baseSection") {
      if (hasLethalDamage(targetId, draft)) {
        // Destroy the card by moving to trash
        const sourceZoneId = `${zone}-${owner}`;
        const trashZoneId = `trash-${owner}`;
        const sourceZone = draft.internal.zones[sourceZoneId];
        const trashZone = draft.internal.zones[trashZoneId];

        if (sourceZone && trashZone) {
          const cardIndex = sourceZone.cardIds.indexOf(targetId);
          if (cardIndex !== -1) {
            sourceZone.cardIds.splice(cardIndex, 1);
            trashZone.cardIds.push(targetId);
          }

          // Clear damage counter
          setCardDamage(draft, targetId, 0);

          // Remove temporary modifiers
          delete draft.external.temporaryModifiers[targetId];

          // Clear card position
          delete draft.external.cardPositions[targetId];
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
    draft.external.cardPositions[targetId] = "rested";
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
    draft.external.cardPositions[targetId] = "active";
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
  const sourceZoneId = `${action.from}-${owner}`;
  const destZoneId = `${action.to}-${owner}`;
  const sourceZone = draft.internal.zones[sourceZoneId];
  const destZone = draft.internal.zones[destZoneId];

  // Verify card is in source zone
  if (!(sourceZone && sourceZone.cardIds.includes(cardId))) {
    return; // Card not in source zone or zone doesn't exist
  }

  if (!destZone) {
    return; // Destination zone doesn't exist
  }

  // Move the card
  const cardIndex = sourceZone.cardIds.indexOf(cardId);
  if (cardIndex !== -1) {
    sourceZone.cardIds.splice(cardIndex, 1);
    destZone.cardIds.push(cardId);
  }

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
    delete draft.external.cardPositions[cardId];
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

    const { zone: fromZoneType, owner } = zoneInfo;

    // Get source zone
    const sourceZoneId = `${fromZoneType}-${owner}`;
    const trashZoneId = `trash-${owner}`;
    const sourceZone = draft.internal.zones[sourceZoneId];
    const trashZone = draft.internal.zones[trashZoneId];

    if (!(sourceZone && trashZone)) {
      continue; // Zones don't exist
    }

    // Move card to trash
    const cardIndex = sourceZone.cardIds.indexOf(cardId);
    if (cardIndex !== -1) {
      sourceZone.cardIds.splice(cardIndex, 1);
      trashZone.cardIds.push(cardId);
    }

    // Clear damage counter
    setCardDamage(draft, cardId, 0);

    // Remove temporary modifiers
    delete draft.external.temporaryModifiers[cardId];

    // Clear card position
    delete draft.external.cardPositions[cardId];
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
  draft: Draft<GundamGameState>,
  action: DiscardAction,
  context: ActionContext,
): void {
  const targetPlayer = resolvePlayerRef(action.player, context, draft);
  if (!targetPlayer) {
    return;
  }

  const handZoneId = `hand-${targetPlayer}`;
  const trashZoneId = `trash-${targetPlayer}`;
  const handZone = draft.internal.zones[handZoneId];
  const trashZone = draft.internal.zones[trashZoneId];

  if (!(handZone && trashZone)) {
    return; // Zones don't exist
  }

  // Determine which cards to discard
  let cardsToDiscard: CardId[] = [];

  if (action.random && action.random === true) {
    // Random discard - select random cards
    const handSize = handZone.cardIds.length;
    const toDiscard = Math.min(action.count, handSize);

    // Simple random selection for T4 (deterministic RNG for T5)
    const handCards = [...handZone.cardIds];
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
      const toDiscard = Math.min(action.count, handZone.cardIds.length);
      cardsToDiscard = handZone.cardIds.slice(0, toDiscard);
    }
  }

  // Move each card to trash
  for (const cardId of cardsToDiscard) {
    const cardIndex = handZone.cardIds.indexOf(cardId);
    if (cardIndex === -1) {
      continue; // Card no longer in hand
    }

    // Remove from hand
    handZone.cardIds.splice(cardIndex, 1);
    // Add to trash
    trashZone.cardIds.push(cardId);
  }
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
    const duration =
      action.duration === "this_turn"
        ? "end_of_turn"
        : action.duration === "end_of_combat"
          ? "end_of_combat"
          : "permanent";

    const modifier: TemporaryModifier = {
      id: createModifierId("stat-mod"),
      cardId,
      type: "stat",
      sourceCardId: context.sourceCardId,
      apModifier: action.apModifier,
      hpModifier: action.hpModifier,
      duration,
    };

    // Initialize modifiers array if needed
    if (!draft.external.temporaryModifiers[cardId]) {
      draft.external.temporaryModifiers[cardId] = [];
    }

    draft.external.temporaryModifiers[cardId].push(modifier);
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
    // Determine duration
    const duration =
      action.duration === "while_condition"
        ? "while_condition"
        : action.duration === "this_turn"
          ? "end_of_turn"
          : "permanent";

    const modifier: TemporaryModifier = {
      id: createModifierId("keyword-grant"),
      cardId,
      type: "keyword",
      sourceCardId: context.sourceCardId,
      grantedKeywords: [action.keyword],
      duration,
      condition:
        action.duration === "while_condition"
          ? (action.condition ?? "")
          : undefined,
    };

    // Initialize modifiers array if needed
    if (!draft.external.temporaryModifiers[cardId]) {
      draft.external.temporaryModifiers[cardId] = [];
    }

    draft.external.temporaryModifiers[cardId].push(modifier);
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
  draft: Draft<GundamGameState>,
  action: SearchAction,
  context: ActionContext,
): void {
  // Determine which zone to search (default to deck)
  const sourceZoneType = action.sourceZone ?? "deck";
  const sourceZoneId = `${sourceZoneType}-${context.controllerId}`;
  const destZoneType = action.destination;
  const destZoneId = `${destZoneType}-${context.controllerId}`;

  const searchZone = draft.internal.zones[sourceZoneId];
  const destZone = draft.internal.zones[destZoneId];

  if (!(searchZone && destZone)) {
    return; // Zones don't exist
  }

  // Apply filter to find matching cards using card definitions
  const matchingCards = searchZone.cardIds.filter((cardId: CardId) =>
    cardMatchesFilter(cardId, action.filter),
  );

  // Select up to count cards
  const toMove = matchingCards.slice(0, action.count);

  // Track revealed cards if reveal is true
  if (action.reveal && toMove.length > 0) {
    // Add revealed cards to tracking
    draft.external.revealedCards.push(...toMove);
  }

  // Move found cards to destination
  for (const cardId of toMove) {
    const cardIndex = searchZone.cardIds.indexOf(cardId);
    if (cardIndex !== -1) {
      searchZone.cardIds.splice(cardIndex, 1);
      destZone.cardIds.push(cardId);
    }
  }

  // Shuffle after search if specified
  if (action.shuffleAfter) {
    // Use deterministic seed based on source card ID and effect instance
    // This ensures consistent shuffling for replays
    const seed = `search-${context.sourceCardId}-${draft.external.effectStack.nextInstanceId}`;
    // Shuffle the zone cardIds in place
    if (searchZone) {
      // Fisher-Yates shuffle with seeded random
      for (let i = searchZone.cardIds.length - 1; i > 0; i--) {
        const j = Math.floor((hashCode(seed) + i) % (i + 1));
        [searchZone.cardIds[i], searchZone.cardIds[j]] = [
          searchZone.cardIds[j],
          searchZone.cardIds[i],
        ];
      }
    }
  }
}

// Helper function to generate a hash code from a string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
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
