/**
 * Static Abilities (Rule 7.6)
 *
 * Static abilities create continuous effects while the card is in play.
 * - Effects apply immediately when conditions are met
 * - Effects are removed when the card leaves play
 * - Some abilities work outside of play
 */

import type { LorcanaCardDefinition } from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import type {
  ActiveContinuousEffect,
  CardFilter,
  Duration,
  StaticAbilityDefinition,
  StaticEffectDefinition,
} from "./ability-types";

/**
 * Check if a static ability is currently active
 */
export function isStaticAbilityActive(
  ability: StaticAbilityDefinition,
  cardInPlay: boolean,
): boolean {
  // Most static abilities only work while in play
  if (!(cardInPlay || ability.worksOutsidePlay)) {
    return false;
  }

  // If there's a condition, it would need to be checked here
  // TODO: Implement condition checking logic here
  // For now, we assume it's active if in play
  return true;
}

/**
 * Check if an effect's duration has expired
 */
export function isDurationExpired(
  duration: Duration,
  currentTurn: number,
  effectCreatedTurn: number,
  currentPlayerId: PlayerId,
  effectOwnerId: PlayerId,
): boolean {
  switch (duration.type) {
    case "untilEndOfTurn":
      return currentTurn > effectCreatedTurn;

    case "untilStartOfNextTurn":
      // Expired if it's a new turn and it's the owner's turn again
      return (
        currentTurn > effectCreatedTurn && currentPlayerId === effectOwnerId
      );

    case "whileInPlay":
      // Never expires due to time - only when card leaves play
      return false;

    case "permanent":
      return false;

    case "untilCondition":
      // Condition checking would be implemented separately
      return false;

    default:
      return false;
  }
}

/**
 * Create an active continuous effect from a static ability
 */
export function createContinuousEffect(
  ability: StaticAbilityDefinition,
  sourceCardId: CardId,
  affectedCardIds: CardId[],
): ActiveContinuousEffect {
  return {
    id: `effect-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    sourceCardId,
    effect: ability.effect,
    duration: ability.duration ?? { type: "whileInPlay" },
    affectedCardIds,
  };
}

/**
 * Get all static ability definitions from a card
 */
export function getStaticAbilities(
  card: LorcanaCardDefinition,
): StaticAbilityDefinition[] {
  const abilities = card.abilities ?? [];
  return abilities.filter(
    (a): a is StaticAbilityDefinition & { text: string } => a.type === "static",
  ) as StaticAbilityDefinition[];
}

/**
 * Calculate strength modifier from static effects
 */
export function calculateStrengthModifier(
  effects: StaticEffectDefinition[],
): number {
  let modifier = 0;
  for (const effect of effects) {
    if (effect.type === "modifyStrength") {
      modifier += (effect.params.amount as number) ?? 0;
    }
  }
  return modifier;
}

/**
 * Calculate willpower modifier from static effects
 */
export function calculateWillpowerModifier(
  effects: StaticEffectDefinition[],
): number {
  let modifier = 0;
  for (const effect of effects) {
    if (effect.type === "modifyWillpower") {
      modifier += (effect.params.amount as number) ?? 0;
    }
  }
  return modifier;
}

/**
 * Calculate lore modifier from static effects
 */
export function calculateLoreModifier(
  effects: StaticEffectDefinition[],
): number {
  let modifier = 0;
  for (const effect of effects) {
    if (effect.type === "modifyLore") {
      modifier += (effect.params.amount as number) ?? 0;
    }
  }
  return modifier;
}

/**
 * Calculate cost modifier from static effects
 */
export function calculateCostModifier(
  effects: StaticEffectDefinition[],
): number {
  let modifier = 0;
  for (const effect of effects) {
    if (effect.type === "modifyCost") {
      modifier += (effect.params.amount as number) ?? 0;
    }
  }
  return modifier;
}

/**
 * Get granted keywords from static effects
 */
export function getGrantedKeywords(
  effects: StaticEffectDefinition[],
): string[] {
  const keywords: string[] = [];
  for (const effect of effects) {
    if (effect.type === "grantKeyword") {
      const keyword = effect.params.keyword as string;
      if (keyword) {
        keywords.push(keyword);
      }
    }
  }
  return keywords;
}

/**
 * Check if an action is prevented by static effects
 */
export function isActionPrevented(
  effects: StaticEffectDefinition[],
  action: string,
): boolean {
  for (const effect of effects) {
    if (effect.type === "preventAction") {
      if (effect.params.action === action) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if an action is required by static effects
 */
export function isActionRequired(
  effects: StaticEffectDefinition[],
  action: string,
): boolean {
  for (const effect of effects) {
    if (effect.type === "requireAction") {
      if (effect.params.action === action) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if card matches a filter (for static effect targeting)
 */
export function matchesCardFilter(
  card: LorcanaCardDefinition,
  cardOwner: PlayerId,
  filter: CardFilter | undefined,
  checkingPlayerId: PlayerId,
): boolean {
  if (!filter) {
    return true;
  }

  if (filter.cardType && card.cardType !== filter.cardType) {
    return false;
  }

  if (filter.inkType) {
    const inkTypes = Array.isArray(card.inkType)
      ? card.inkType
      : [card.inkType];
    // Cast filter.inkType to ensure it matches the InkType union
    // InkType is a union of strings, so we just need to ensure TypeScript knows we're comparing strings
    // or cast to the specific InkType if imported, but avoiding tight coupling here.
    const filterInkType = filter.inkType;
    if (!inkTypes.some((t) => t === filterInkType)) {
      return false;
    }
  }

  if (filter.classification && card.classifications) {
    if (!card.classifications.includes(filter.classification as any)) {
      return false;
    }
  }

  if (filter.hasKeyword && card.keywords) {
    const hasKeyword = card.keywords.some((k) =>
      typeof k === "string"
        ? k === filter.hasKeyword
        : k.type === filter.hasKeyword,
    );
    if (!hasKeyword) {
      return false;
    }
  }

  if (filter.controller) {
    if (filter.controller === "you" && cardOwner !== checkingPlayerId) {
      return false;
    }
    if (filter.controller === "opponent" && cardOwner === checkingPlayerId) {
      return false;
    }
  }

  return true;
}
