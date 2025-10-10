/**
 * Card Registry Interface
 *
 * Provides type-safe access to card definitions (static card data).
 * This is separate from CardOperations which handles dynamic card state/metadata.
 *
 * @template TCardDefinition - The static card definition type for the game
 *
 * @example
 * ```typescript
 * type MyCardDef = {
 *   id: string;
 *   name: string;
 *   cost: number;
 *   attack?: number;
 * };
 *
 * const registry: CardRegistry<MyCardDef> = createCardRegistry(cardDefinitions);
 *
 * // Get a specific card
 * const card = registry.getCard('pikachu');
 * if (card) {
 *   console.log(card.name, card.cost);
 * }
 *
 * // Query cards
 * const expensiveCards = registry.queryCards(card => card.cost >= 5);
 * ```
 */
export interface CardRegistry<TCardDefinition> {
  /**
   * Get a card definition by its definition ID
   *
   * @param definitionId - The card definition ID
   * @returns The card definition, or undefined if not found
   *
   * @example
   * ```typescript
   * const card = registry.getCard('pikachu');
   * if (card) {
   *   console.log(card.name); // "Pikachu"
   * }
   * ```
   */
  getCard(definitionId: string): TCardDefinition | undefined;

  /**
   * Check if a card definition exists
   *
   * @param definitionId - The card definition ID
   * @returns True if the card exists, false otherwise
   *
   * @example
   * ```typescript
   * if (registry.hasCard('pikachu')) {
   *   // Card exists in registry
   * }
   * ```
   */
  hasCard(definitionId: string): boolean;

  /**
   * Get all card definitions
   *
   * @returns Array of all card definitions
   *
   * @example
   * ```typescript
   * const allCards = registry.getAllCards();
   * console.log(`Total cards: ${allCards.length}`);
   * ```
   */
  getAllCards(): TCardDefinition[];

  /**
   * Query cards by predicate
   *
   * Searches all card definitions and returns those matching the predicate.
   *
   * @param predicate - Function to test each card
   * @returns Array of matching card definitions
   *
   * @example
   * ```typescript
   * // Find all expensive cards
   * const expensive = registry.queryCards(card => card.cost >= 5);
   *
   * // Find all fire-type cards
   * const fireCards = registry.queryCards(card => card.type === 'fire');
   * ```
   */
  queryCards(predicate: (card: TCardDefinition) => boolean): TCardDefinition[];

  /**
   * Get total number of cards in the registry
   *
   * @returns Total card count
   *
   * @example
   * ```typescript
   * const count = registry.getCardCount();
   * console.log(`${count} cards available`);
   * ```
   */
  getCardCount(): number;
}
