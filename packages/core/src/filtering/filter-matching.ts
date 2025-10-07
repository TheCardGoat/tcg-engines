import type { DefinitionRegistry } from "../cards/card-definition";
import { getCardDefinition } from "../cards/card-definition";
import type { CardInstance } from "../cards/card-instance";
import {
  getCardCost,
  getCardPower,
  getCardToughness,
} from "../cards/computed-properties";
import type { CardFilter, NumberFilter } from "./card-filter";

/**
 * Checks if a number matches a NumberFilter
 * @param filter - Number filter to match against
 * @param value - Value to check
 * @returns true if value matches the filter
 */
export function matchesNumberFilter(
  filter: NumberFilter,
  value: number,
): boolean {
  // Direct number comparison (exact match)
  if (typeof filter === "number") {
    return value === filter;
  }

  // Object-based filters
  if ("eq" in filter) {
    return value === filter.eq;
  }

  if ("gte" in filter) {
    return value >= filter.gte;
  }

  if ("lte" in filter) {
    return value <= filter.lte;
  }

  if ("gt" in filter) {
    return value > filter.gt;
  }

  if ("lt" in filter) {
    return value < filter.lt;
  }

  if ("between" in filter) {
    const [min, max] = filter.between;
    return value >= min && value <= max;
  }

  return false;
}

/**
 * Checks if a card matches a CardFilter
 * @param card - Card instance to check
 * @param filter - Filter to match against
 * @param state - Game state for computed properties
 * @param registry - Card definition registry
 * @returns true if card matches the filter
 */
export function matchesFilter<TGameState>(
  card: CardInstance,
  filter: CardFilter<TGameState>,
  state: TGameState,
  registry: DefinitionRegistry,
): boolean {
  const definition = getCardDefinition(registry, card.definitionId);

  // Zone filtering
  if (filter.zone !== undefined) {
    if (Array.isArray(filter.zone)) {
      if (!filter.zone.includes(card.zone)) {
        return false;
      }
    } else if (card.zone !== filter.zone) {
      return false;
    }
  }

  // Owner filtering
  if (filter.owner !== undefined) {
    if (Array.isArray(filter.owner)) {
      if (!filter.owner.includes(card.owner)) {
        return false;
      }
    } else if (card.owner !== filter.owner) {
      return false;
    }
  }

  // Controller filtering
  if (filter.controller !== undefined) {
    if (Array.isArray(filter.controller)) {
      if (!filter.controller.includes(card.controller)) {
        return false;
      }
    } else if (card.controller !== filter.controller) {
      return false;
    }
  }

  // Type filtering
  if (filter.type !== undefined && definition) {
    if (Array.isArray(filter.type)) {
      if (!filter.type.includes(definition.type)) {
        return false;
      }
    } else if (definition.type !== filter.type) {
      return false;
    }
  }

  // Subtype filtering (not implemented in current CardDefinition, reserved for future)
  if (filter.subtype !== undefined) {
    // When subtype is added to CardDefinition, implement here
    return false;
  }

  // Name filtering
  if (filter.name !== undefined && definition) {
    if (typeof filter.name === "string") {
      if (definition.name !== filter.name) {
        return false;
      }
    } else if (filter.name instanceof RegExp) {
      if (!filter.name.test(definition.name)) {
        return false;
      }
    }
  }

  // Cost filtering
  if (filter.cost !== undefined && definition) {
    const cardWithModifiers = card as unknown as CardInstance<{
      modifiers: never[];
    }>;
    const cost = getCardCost(cardWithModifiers, state, registry);
    if (!matchesNumberFilter(filter.cost, cost)) {
      return false;
    }
  }

  // Power filtering
  if (filter.power !== undefined && definition) {
    const cardWithModifiers = card as unknown as CardInstance<{
      modifiers: never[];
    }>;
    const power = getCardPower(cardWithModifiers, state, registry);
    if (!matchesNumberFilter(filter.power, power)) {
      return false;
    }
  }

  // Toughness filtering
  if (filter.toughness !== undefined && definition) {
    const cardWithModifiers = card as unknown as CardInstance<{
      modifiers: never[];
    }>;
    const toughness = getCardToughness(cardWithModifiers, state, registry);
    if (!matchesNumberFilter(filter.toughness, toughness)) {
      return false;
    }
  }

  // Tapped state filtering
  if (filter.tapped !== undefined) {
    if (card.tapped !== filter.tapped) {
      return false;
    }
  }

  // Revealed state filtering
  if (filter.revealed !== undefined) {
    if (card.revealed !== filter.revealed) {
      return false;
    }
  }

  // Composite filters - AND
  if (filter.and !== undefined) {
    for (const subFilter of filter.and) {
      if (!matchesFilter(card, subFilter, state, registry)) {
        return false;
      }
    }
  }

  // Composite filters - OR
  if (filter.or !== undefined) {
    let anyMatch = false;
    for (const subFilter of filter.or) {
      if (matchesFilter(card, subFilter, state, registry)) {
        anyMatch = true;
        break;
      }
    }
    if (!anyMatch) {
      return false;
    }
  }

  // Composite filters - NOT
  if (filter.not !== undefined) {
    if (matchesFilter(card, filter.not, state, registry)) {
      return false;
    }
  }

  // Custom predicate
  if (filter.where !== undefined) {
    if (!filter.where(card, state)) {
      return false;
    }
  }

  return true;
}

/**
 * Selects all cards from state that match the filter
 * @param state - Game state containing cards
 * @param filter - Filter to apply
 * @param registry - Card definition registry
 * @returns Array of matching cards
 */
export function selectCards<
  TGameState extends { cards: Record<string, CardInstance<any>> },
>(
  state: TGameState,
  filter: CardFilter<TGameState>,
  registry: DefinitionRegistry,
): CardInstance<any>[] {
  const cards = Object.values(state.cards);
  return cards.filter((card) => matchesFilter(card, filter, state, registry));
}

/**
 * Counts cards that match the filter
 * @param state - Game state containing cards
 * @param filter - Filter to apply
 * @param registry - Card definition registry
 * @returns Number of matching cards
 */
export function countCards<
  TGameState extends { cards: Record<string, CardInstance<any>> },
>(
  state: TGameState,
  filter: CardFilter<TGameState>,
  registry: DefinitionRegistry,
): number {
  return selectCards(state, filter, registry).length;
}

/**
 * Checks if any card matches the filter
 * @param state - Game state containing cards
 * @param filter - Filter to apply
 * @param registry - Card definition registry
 * @returns true if at least one card matches
 */
export function anyCard<
  TGameState extends { cards: Record<string, CardInstance<any>> },
>(
  state: TGameState,
  filter: CardFilter<TGameState>,
  registry: DefinitionRegistry,
): boolean {
  const cards = Object.values(state.cards);
  return cards.some((card) => matchesFilter(card, filter, state, registry));
}
