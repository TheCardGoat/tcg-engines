import type { CardRegistry } from "./card-registry";

/**
 * Creates a CardRegistry implementation from a record or array of card definitions
 *
 * @param cards - Record mapping card definition IDs to card definitions,
 *                OR array of definitions with `id` property
 * @returns CardRegistry implementation
 *
 * @example
 * ```typescript
 * // From record:
 * const cards = {
 *   'pikachu': { id: 'pikachu', name: 'Pikachu', cost: 3 },
 *   'charizard': { id: 'charizard', name: 'Charizard', cost: 8 },
 * };
 * const registry = createCardRegistry(cards);
 *
 * // From array:
 * const cardArray = [
 *   { id: 'pikachu', name: 'Pikachu', cost: 3 },
 *   { id: 'charizard', name: 'Charizard', cost: 8 },
 * ];
 * const registry = createCardRegistry(cardArray);
 *
 * const pikachu = registry.getCard('pikachu');
 * ```
 */
export function createCardRegistry<TCardDefinition>(
  cards: Record<string, TCardDefinition> | (TCardDefinition & { id: string })[] = {} as Record<
    string,
    TCardDefinition
  >,
): CardRegistry<TCardDefinition> {
  // Convert array to record if needed
  const cardsRecord: Record<string, TCardDefinition> = Array.isArray(cards)
    ? cards.reduce(
        (acc, card) => {
          acc[card.id] = card;
          return acc;
        },
        {} as Record<string, TCardDefinition>,
      )
    : cards;
  return {
    getAllCards(): TCardDefinition[] {
      return Object.values(cardsRecord);
    },

    getCard(definitionId: string): TCardDefinition | undefined {
      return cardsRecord[definitionId];
    },

    getCardCount(): number {
      return Object.keys(cardsRecord).length;
    },

    hasCard(definitionId: string): boolean {
      return definitionId in cardsRecord;
    },

    queryCards(predicate: (card: TCardDefinition) => boolean): TCardDefinition[] {
      return Object.values(cardsRecord).filter(predicate);
    },
  };
}
