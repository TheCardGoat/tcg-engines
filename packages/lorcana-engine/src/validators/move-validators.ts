/**
 * Composable Move Validators
 *
 * Reusable validation functions for Lorcana moves.
 * Each validator is a pure predicate that can be composed with others.
 *
 * Design principles:
 * - Small, focused validators
 * - Composable via &&, ||, !
 * - Testable in isolation
 * - Type-safe with proper context
 */

import type { CardId, MoveContext, PlayerId, ZoneId } from "@tcg/core";
import type { LorcanaCardMeta, LorcanaGameState } from "../types";

/**
 * Validator function type
 *
 * Matches the condition signature from GameMoveDefinition.
 * Takes state and context, returns boolean indicating validity.
 */
export type Validator<TParams = unknown> = (
  state: LorcanaGameState,
  context: MoveContext<TParams, LorcanaCardMeta>,
) => boolean;

/**
 * Parameterized validator type
 *
 * Takes arguments and returns a validator function.
 * Allows validators to be configured per-move.
 */
export type ParameterizedValidator<TArgs extends unknown[], TParams = unknown> = (
  ...args: TArgs
) => Validator<TParams>;

// ===== Phase/Flow Validators =====

/**
 * Validate current phase
 *
 * @param expectedPhase - Required phase name
 * @returns Validator that checks if current phase matches
 *
 * @example
 * ```typescript
 * condition: isPhase("main")
 * ```
 */
export const isPhase =
  <TParams = unknown>(expectedPhase: string): Validator<TParams> =>
  (_state, context) =>
    context.flow?.currentPhase === expectedPhase;

/**
 * Validate it's the main phase specifically
 *
 * Most Lorcana actions require main phase.
 */
export const isMainPhase = <TParams = unknown>(): Validator<TParams> => isPhase<TParams>("main");

// ===== Card Location Validators =====

/**
 * Validate card is in a specific zone
 *
 * @param cardId - Card to check
 * @param zoneId - Expected zone
 * @returns Validator that checks card location
 *
 * @example
 * ```typescript
 * condition: (state, context) =>
 *   cardInZone(context.params.cardId, "hand")(context)
 * ```
 */
export const cardInZone =
  <TParams = unknown>(cardId: CardId, zoneId: ZoneId): Validator<TParams> =>
  (_state, context) =>
    context.zones.getCardZone(cardId) === zoneId;

/**
 * Validate card is in hand
 */
export const cardInHand = <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  cardInZone(cardId, "hand" as ZoneId);

/**
 * Validate card is in play
 */
export const cardInPlay = <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  cardInZone(cardId, "play" as ZoneId);

/**
 * Validate card exists in any zone
 *
 * @param cardId - Card to check
 * @returns Validator that checks if card exists
 */
export const cardExists =
  <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  (_state, context) =>
    context.zones.getCardZone(cardId) !== undefined;

// ===== Ownership Validators =====

/**
 * Validate card is owned by the current player
 *
 * @param cardId - Card to check
 * @returns Validator that checks ownership
 *
 * @example
 * ```typescript
 * condition: (state, context) =>
 *   cardOwnedByPlayer(context.params.cardId)(context)
 * ```
 */
export const cardOwnedByPlayer =
  <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  (_state, context) =>
    context.cards.getCardOwner(cardId) === context.playerId;

/**
 * Validate card is owned by a specific player
 */
export const cardOwnedBy =
  <TParams = unknown>(cardId: CardId, playerId: PlayerId): Validator<TParams> =>
  (_state, context) =>
    context.cards.getCardOwner(cardId) === playerId;

// ===== Tracker Validators =====

/**
 * Validate action has not been used this turn
 *
 * @param actionName - Tracker name to check
 * @param playerId - Optional player ID (defaults to current player)
 * @returns Validator that checks tracker
 *
 * @example
 * ```typescript
 * condition: hasNotUsedAction("hasInked")
 * ```
 */
export const hasNotUsedAction =
  <TParams = unknown>(actionName: string, playerId?: PlayerId): Validator<TParams> =>
  (_state, context) => {
    const player = playerId ?? context.playerId;
    return !context.trackers?.check(actionName, player);
  };

/**
 * Validate action has been used
 */
export const hasUsedAction =
  <TParams = unknown>(actionName: string, playerId?: PlayerId): Validator<TParams> =>
  (_state, context) => {
    const player = playerId ?? context.playerId;
    return context.trackers?.check(actionName, player) ?? false;
  };

// ===== Card State Validators =====

/**
 * Validate card is not exerted (ready)
 *
 * @param cardId - Card to check
 * @returns Validator that checks exerted status
 *
 * @example
 * ```typescript
 * condition: (state, context) =>
 *   cardIsReady(context.params.cardId)(context)
 * ```
 */
export const cardIsReady =
  <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  (_state, context) => {
    const meta = context.cards.getCardMeta(cardId);
    return meta?.state === "ready";
  };

/**
 * Validate card is exerted
 */
export const cardIsExerted =
  <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  (_state, context) => {
    const meta = context.cards.getCardMeta(cardId);
    return meta?.state === "exerted";
  };

/**
 * Validate card is "dry" (not played this turn)
 *
 * Rule 4.2.2.1: Characters are "drying" the turn they're played
 * Rule 6.1.4: Must be dry to quest, challenge, or exert
 *
 * @param cardId - Card to check
 * @returns Validator that checks if card is dry
 */
export const cardIsDry =
  <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  (_state, context) => {
    const meta = context.cards.getCardMeta(cardId);
    return !meta?.isDrying;
  };

/**
 * Validate card was played this turn (is drying)
 */
export const cardIsDrying =
  <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  (_state, context) => {
    const meta = context.cards.getCardMeta(cardId);
    return meta?.isDrying ?? false;
  };

// ===== Composite Validators =====

/**
 * Validate card can quest
 *
 * Requirements (Rule 4.3.5, Rule 6.1.4):
 * - Card is in play
 * - Card is owned by current player
 * - Card is ready (not exerted)
 * - Card is dry (not played this turn)
 * - Card hasn't quested this turn
 *
 * @param cardId - Card to check
 * @returns Validator that checks all quest requirements
 *
 * @example
 * ```typescript
 * condition: (state, context) =>
 *   canQuest(context.params.cardId)(context)
 * ```
 */
export const canQuest =
  <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  (state, context) =>
    cardInPlay(cardId)(state, context) &&
    cardOwnedByPlayer(cardId)(state, context) &&
    cardIsReady(cardId)(state, context) &&
    cardIsDry(cardId)(state, context) &&
    hasNotUsedAction(`quested:${cardId}`)(state, context);

/**
 * Validate card can challenge
 *
 * Requirements (Rule 4.3.6, Rule 6.1.4):
 * - Card is in play
 * - Card is owned by current player
 * - Card is ready (not exerted)
 * - Card is dry (not played this turn)
 *
 * @param cardId - Card to check
 * @returns Validator that checks all challenge requirements
 */
export const canChallenge =
  <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  (state, context) =>
    cardInPlay(cardId)(state, context) &&
    cardOwnedByPlayer(cardId)(state, context) &&
    cardIsReady(cardId)(state, context) &&
    cardIsDry(cardId)(state, context);

/**
 * Validate card can be used to pay costs (e.g., singing, abilities)
 *
 * Requirements (Rule 6.1.4):
 * - Card is in play
 * - Card is owned by current player
 * - Card is ready (not exerted)
 * - Card is dry (not played this turn)
 *
 * @param cardId - Card to check
 * @returns Validator that checks if card can pay costs
 */
export const canPayCosts =
  <TParams = unknown>(cardId: CardId): Validator<TParams> =>
  (state, context) =>
    cardInPlay(cardId)(state, context) &&
    cardOwnedByPlayer(cardId)(state, context) &&
    cardIsReady(cardId)(state, context) &&
    cardIsDry(cardId)(state, context);

// ===== Logical Combinators =====

/**
 * Combine validators with AND logic
 *
 * @param validators - Validators to combine
 * @returns Validator that checks all validators
 *
 * @example
 * ```typescript
 * condition: and(
 *   isMainPhase(),
 *   (context) => cardInHand(context.params.cardId)(context),
 *   (context) => hasNotUsedAction("hasInked")()(context)
 * )
 * ```
 */
export const and =
  <TParams = unknown>(...validators: Validator<TParams>[]): Validator<TParams> =>
  (state, context) =>
    validators.every((validator) => validator(state, context));

/**
 * Combine validators with OR logic
 */
export const or =
  <TParams = unknown>(...validators: Validator<TParams>[]): Validator<TParams> =>
  (state, context) =>
    validators.some((validator) => validator(state, context));

/**
 * Negate a validator
 */
export const not =
  <TParams = unknown>(validator: Validator<TParams>): Validator<TParams> =>
  (state, context) =>
    !validator(state, context);

/**
 * Always returns true (no-op validator)
 */
export const always =
  <TParams = unknown>(): Validator<TParams> =>
  () =>
    true;

/**
 * Always returns false (deny-all validator)
 */
export const never =
  <TParams = unknown>(): Validator<TParams> =>
  () =>
    false;
