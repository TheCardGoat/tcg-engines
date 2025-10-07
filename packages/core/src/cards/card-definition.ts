/**
 * Card Definition - Static, immutable data for a card type
 * This represents the "blueprint" of a card, not an instance in play.
 * All instances of the same card share the same definition.
 */
export type CardDefinition = {
  /** Unique identifier for this card definition */
  id: string;

  /** Display name of the card */
  name: string;

  /** Card type (e.g., 'creature', 'instant', 'sorcery', 'enchantment') */
  type: string;

  /** Base power value (for creatures) */
  basePower?: number;

  /** Base toughness/health value (for creatures) */
  baseToughness?: number;

  /** Base mana/resource cost to play the card */
  baseCost?: number;

  /** Static abilities this card has */
  abilities?: string[];
};

/**
 * Registry type for storing card definitions
 */
export type DefinitionRegistry = Map<string, CardDefinition>;

/**
 * Creates a definition registry from an array of card definitions
 * @param definitions - Array of card definitions to register
 * @returns Registry map of definition id to definition
 */
export function createDefinitionRegistry(
  definitions: CardDefinition[],
): DefinitionRegistry {
  const registry = new Map<string, CardDefinition>();

  for (const definition of definitions) {
    registry.set(definition.id, definition);
  }

  return registry;
}

/**
 * Retrieves a card definition from the registry by its id
 * @param registry - Definition registry to search
 * @param definitionId - ID of the definition to retrieve
 * @returns Card definition if found, undefined otherwise
 */
export function getCardDefinition(
  registry: DefinitionRegistry,
  definitionId: string,
): CardDefinition | undefined {
  return registry.get(definitionId);
}
