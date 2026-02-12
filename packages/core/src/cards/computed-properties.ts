import type { CardRegistry } from "../operations/card-registry";
import type { CardDefinition } from "./card-definition";
import type { CardInstance } from "./card-instance";
import type { Modifier } from "./modifiers";

/**
 * Gets the computed power of a card (base power + modifiers)
 * Pure function - same inputs always produce same output
 *
 * @param card - Card instance with modifiers
 * @param state - Game state (for conditional modifiers)
 * @param registry - Card definition registry
 * @returns Computed power value
 */
export function getCardPower<TGameState = unknown>(
  card: CardInstance<{ modifiers: Modifier<TGameState>[] }>,
  state: TGameState,
  registry: CardRegistry<CardDefinition>,
): number {
  const definition = registry.getCard(card.definitionId);
  const basePower = definition?.basePower ?? 0;

  // Sum all power modifiers
  const modifierBonus = card.modifiers
    .filter((m) => m.type === "stat" && m.property === "power")
    .filter((m) => !m.condition || m.condition(state)) // Check conditions
    .reduce((sum, m) => sum + (m.value as number), 0);

  return basePower + modifierBonus;
}

/**
 * Gets the computed toughness of a card (base toughness + modifiers)
 * Pure function - same inputs always produce same output
 *
 * @param card - Card instance with modifiers
 * @param state - Game state (for conditional modifiers)
 * @param registry - Card definition registry
 * @returns Computed toughness value
 */
export function getCardToughness<TGameState = unknown>(
  card: CardInstance<{ modifiers: Modifier<TGameState>[] }>,
  state: TGameState,
  registry: CardRegistry<CardDefinition>,
): number {
  const definition = registry.getCard(card.definitionId);
  const baseToughness = definition?.baseToughness ?? 0;

  // Sum all toughness modifiers
  const modifierBonus = card.modifiers
    .filter((m) => m.type === "stat" && m.property === "toughness")
    .filter((m) => !m.condition || m.condition(state)) // Check conditions
    .reduce((sum, m) => sum + (m.value as number), 0);

  return baseToughness + modifierBonus;
}

/**
 * Gets the computed cost of a card (base cost + modifiers)
 * Pure function - same inputs always produce same output
 * Cost cannot go below zero
 *
 * @param card - Card instance with modifiers
 * @param state - Game state (for conditional modifiers)
 * @param registry - Card definition registry
 * @returns Computed cost value (minimum 0)
 */
export function getCardCost<TGameState = unknown>(
  card: CardInstance<{ modifiers: Modifier<TGameState>[] }>,
  state: TGameState,
  registry: CardRegistry<CardDefinition>,
): number {
  const definition = registry.getCard(card.definitionId);
  const baseCost = definition?.baseCost ?? 0;

  // Sum all cost modifiers (can be negative for cost reduction)
  const costModification = card.modifiers
    .filter((m) => m.type === "stat" && m.property === "cost")
    .filter((m) => !m.condition || m.condition(state)) // Check conditions
    .reduce((sum, m) => sum + (m.value as number), 0);

  // Cost cannot go below zero
  return Math.max(0, baseCost + costModification);
}
