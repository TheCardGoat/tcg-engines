import type { CardRegistry } from "./card-registry";

/**
 * Creates a CardRegistry implementation from a record of card definitions
 *
 * @param cards - Record mapping card definition IDs to card definitions
 * @returns CardRegistry implementation
 *
 * @example
 * ```typescript
 * const cards = {
 *   'pikachu': { id: 'pikachu', name: 'Pikachu', cost: 3 },
 *   'charizard': { id: 'charizard', name: 'Charizard', cost: 8 },
 * };
 *
 * const registry = createCardRegistry(cards);
 * const pikachu = registry.getCard('pikachu');
 * ```
 */
export function createCardRegistry<TCardDefinition>(
  cards: Record<string, TCardDefinition> = {},
): CardRegistry<TCardDefinition> {
  return {
    getCard(definitionId: string): TCardDefinition | undefined {
      return cards[definitionId];
    },

    hasCard(definitionId: string): boolean {
      return definitionId in cards;
    },

    getAllCards(): TCardDefinition[] {
      return Object.values(cards);
    },

    queryCards(
      predicate: (card: TCardDefinition) => boolean,
    ): TCardDefinition[] {
      return Object.values(cards).filter(predicate);
    },

    getCardCount(): number {
      return Object.keys(cards).length;
    },
  };
}
