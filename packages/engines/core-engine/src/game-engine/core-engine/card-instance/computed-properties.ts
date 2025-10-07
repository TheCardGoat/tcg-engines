/**
 * Computed Properties
 *
 * Pure functions for computing card properties from base values and modifiers.
 * These functions never mutate state and are deterministic.
 */

import type {
  CardDefinition,
  DefinitionRegistry,
} from "./card-definition-types";
import type { CardInstance } from "./card-instance-types";
import type { Modifier } from "./modifier-types";

/**
 * Creates a definition registry from an array of card definitions.
 *
 * @param definitions - Array of card definitions to register
 * @returns A definition registry for looking up cards by ID
 */
export const createDefinitionRegistry = (
  definitions: CardDefinition[],
): DefinitionRegistry => {
  const definitionMap = new Map<string, CardDefinition>();

  for (const definition of definitions) {
    definitionMap.set(definition.id, definition);
  }

  return {
    getDefinition: (id: string) => definitionMap.get(id),
  };
};

/**
 * Gets the computed power of a card instance.
 *
 * Computes power by:
 * 1. Getting base power from card definition
 * 2. Summing all applicable power modifiers
 * 3. Evaluating conditional modifiers based on game state
 *
 * @param card - Card instance with modifiers
 * @param state - Current game state for condition evaluation
 * @param registry - Registry for looking up card definitions
 * @returns Computed power value
 *
 * @example
 * const card: CardInstance<{ modifiers: Modifier[] }> = {
 *   id: createCardId("card-1"),
 *   definitionId: "grizzly-bears",
 *   modifiers: [
 *     { id: "buff", type: "stat", property: "power", value: 2, duration: "permanent", source: createCardId("source") }
 *   ],
 *   // ... other fields
 * };
 *
 * const power = getCardPower(card, gameState, registry); // Returns 4 (2 base + 2 modifier)
 */
export const getCardPower = <TGameState>(
  card: CardInstance<{ modifiers: Modifier<TGameState>[] }>,
  state: TGameState,
  registry: DefinitionRegistry,
): number => {
  const definition = registry.getDefinition(card.definitionId);
  const basePower = definition?.basePower ?? 0;

  const modifierBonus = card.modifiers
    .filter((m) => m.type === "stat" && m.property === "power")
    .filter((m) => !m.condition || m.condition(state))
    .reduce((sum, m) => sum + (m.value as number), 0);

  return basePower + modifierBonus;
};

/**
 * Gets the computed toughness of a card instance.
 *
 * Computes toughness by:
 * 1. Getting base toughness from card definition
 * 2. Summing all applicable toughness modifiers
 * 3. Evaluating conditional modifiers based on game state
 *
 * @param card - Card instance with modifiers
 * @param state - Current game state for condition evaluation
 * @param registry - Registry for looking up card definitions
 * @returns Computed toughness value
 */
export const getCardToughness = <TGameState>(
  card: CardInstance<{ modifiers: Modifier<TGameState>[] }>,
  state: TGameState,
  registry: DefinitionRegistry,
): number => {
  const definition = registry.getDefinition(card.definitionId);
  const baseToughness = definition?.baseToughness ?? 0;

  const modifierBonus = card.modifiers
    .filter((m) => m.type === "stat" && m.property === "toughness")
    .filter((m) => !m.condition || m.condition(state))
    .reduce((sum, m) => sum + (m.value as number), 0);

  return baseToughness + modifierBonus;
};

/**
 * Gets the computed cost of a card instance.
 *
 * Computes cost by:
 * 1. Getting base cost from card definition
 * 2. Summing all applicable cost modifiers (usually reductions)
 * 3. Evaluating conditional modifiers based on game state
 * 4. Ensuring cost never goes below 0
 *
 * @param card - Card instance with modifiers
 * @param state - Current game state for condition evaluation
 * @param registry - Registry for looking up card definitions
 * @returns Computed cost value (minimum 0)
 *
 * @example
 * // Cost reduction effect
 * const costReduction: Modifier = {
 *   id: "affinity",
 *   type: "stat",
 *   property: "cost",
 *   value: -2,
 *   duration: "permanent",
 *   source: createCardId("artifact"),
 * };
 *
 * const cost = getCardCost(card, gameState, registry); // Base 3 - 2 = 1
 */
export const getCardCost = <TGameState>(
  card: CardInstance<{ modifiers: Modifier<TGameState>[] }>,
  state: TGameState,
  registry: DefinitionRegistry,
): number => {
  const definition = registry.getDefinition(card.definitionId);
  const baseCost = definition?.baseCost ?? 0;

  const costModifier = card.modifiers
    .filter((m) => m.type === "stat" && m.property === "cost")
    .filter((m) => !m.condition || m.condition(state))
    .reduce((sum, m) => sum + (m.value as number), 0);

  return Math.max(0, baseCost + costModifier);
};
