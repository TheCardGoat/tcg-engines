/**
 * Activated Abilities (Rule 7.5)
 *
 * Activated abilities require paying a cost to use.
 * - Exert abilities require the card to be ready and dry
 * - Items can use abilities the turn they're played (Rule 4.3.8.3)
 * - Characters must be dry for exert abilities
 */

import { hasRush, isItem } from "../card-utils";
import type {
  MoveValidationError,
  MoveValidationResult,
} from "../moves/move-types";
import { invalidMove, validMove } from "../moves/move-types";
import type { LorcanaCardDefinition } from "../types/card-types";
import type { PlayerId } from "../types/game-state";
import type { CardInstanceState } from "../zones/card-state";
import type { AbilityCost, ActivatedAbilityDefinition } from "./ability-types";

/**
 * Check if an exert cost can be paid
 */
export function canPayExertCost(
  card: LorcanaCardDefinition,
  state: CardInstanceState,
): boolean {
  // Must be ready
  if (state.state === "exerted") {
    return false;
  }

  // Items can use abilities the turn played (Rule 4.3.8.3)
  if (isItem(card)) {
    return true;
  }

  // Characters with Rush can use abilities the turn played
  if (hasRush(card)) {
    return true;
  }

  // Characters must be dry (not drying)
  if (state.isDrying) {
    return false;
  }

  return true;
}

/**
 * Check if ink cost can be paid
 */
export function canPayInkCost(required: number, availableInk: number): boolean {
  return availableInk >= required;
}

/**
 * Check if discard cost can be paid
 */
export function canPayDiscardCost(required: number, handSize: number): boolean {
  return handSize >= required;
}

/**
 * Validate if an activated ability can be used
 */
export function validateActivatedAbility(
  card: LorcanaCardDefinition | undefined,
  state: CardInstanceState | undefined,
  cardOwner: PlayerId,
  activePlayerId: PlayerId,
  isMainPhase: boolean,
  ability: ActivatedAbilityDefinition,
  availableInk: number,
  handSize: number,
): MoveValidationResult {
  const errors: MoveValidationError[] = [];

  // Must be active player's card
  if (cardOwner !== activePlayerId) {
    errors.push({ type: "NOT_YOUR_CARD" });
  }

  // Must be main phase
  if (!isMainPhase) {
    errors.push({ type: "NOT_MAIN_PHASE" });
  }

  // Card must exist and be in play
  if (!card) {
    errors.push({ type: "NOT_IN_PLAY" });
    return invalidMove(...errors);
  }

  if (!state) {
    errors.push({ type: "NOT_IN_PLAY" });
    return invalidMove(...errors);
  }

  // Check exert cost
  if (ability.cost.exert) {
    if (state.state === "exerted") {
      errors.push({ type: "CARD_NOT_READY" });
    } else if (!canPayExertCost(card, state)) {
      errors.push({ type: "CARD_IS_DRYING" });
    }
  }

  // Check ink cost
  if (ability.cost.ink && ability.cost.ink > 0) {
    if (!canPayInkCost(ability.cost.ink, availableInk)) {
      errors.push({
        type: "INSUFFICIENT_INK",
        required: ability.cost.ink,
        available: availableInk,
      });
    }
  }

  // Check discard cost
  if (ability.cost.discardCards && ability.cost.discardCards > 0) {
    if (!canPayDiscardCost(ability.cost.discardCards, handSize)) {
      errors.push({
        type: "INSUFFICIENT_CARDS_TO_DISCARD",
        required: ability.cost.discardCards,
        available: handSize,
      });
    }
  }

  if (errors.length > 0) {
    return invalidMove(...errors);
  }

  return validMove();
}

/**
 * Check if an activated ability can be used (simplified)
 */
export function canUseActivatedAbility(
  card: LorcanaCardDefinition | undefined,
  state: CardInstanceState | undefined,
  cardOwner: PlayerId,
  activePlayerId: PlayerId,
  isMainPhase: boolean,
  ability: ActivatedAbilityDefinition,
  availableInk: number,
  handSize: number,
): boolean {
  const result = validateActivatedAbility(
    card,
    state,
    cardOwner,
    activePlayerId,
    isMainPhase,
    ability,
    availableInk,
    handSize,
  );
  return result.valid;
}

/**
 * Get all activated ability definitions from a card
 */
export function getActivatedAbilities(
  card: LorcanaCardDefinition,
): ActivatedAbilityDefinition[] {
  const abilities = card.abilities ?? [];
  return abilities.filter(
    (a): boolean => a.type === "activated",
  ) as unknown as ActivatedAbilityDefinition[];
}

/**
 * Find an activated ability by ID
 */
export function findActivatedAbility(
  card: LorcanaCardDefinition,
  abilityId: string,
): ActivatedAbilityDefinition | undefined {
  const abilities = getActivatedAbilities(card);
  return abilities.find((a) => a.id === abilityId);
}

/**
 * Check if an ability is "for free" (ignores ink cost only)
 */
export function isAbilityFree(cost: AbilityCost): boolean {
  return (cost.ink ?? 0) === 0;
}

/**
 * Get the total ink cost of an ability
 */
export function getAbilityInkCost(cost: AbilityCost): number {
  return cost.ink ?? 0;
}

/**
 * Check if ability requires exerting the card
 */
export function requiresExert(cost: AbilityCost): boolean {
  return cost.exert ?? false;
}
