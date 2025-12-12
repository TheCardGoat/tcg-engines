import type { CardDefinition } from "../cards/card-definition";
import type { CardInstance } from "../cards/card-instance";
import type { CardRegistry } from "../operations/card-registry";
import type { PlayerId, ZoneId } from "../types";
import type { CardFilter, PropertyFilter } from "./card-filter";
import { anyCard, countCards, selectCards } from "./filter-matching";

/**
 * Fluent builder API for constructing card queries
 * Provides chainable methods to build complex CardFilter objects
 * @template TGameState - The game state type
 */
export class CardQuery<
  TGameState extends { cards: Record<string, CardInstance<any>> },
> {
  private filter: CardFilter<TGameState> = {};

  private constructor(
    private state: TGameState,
    private registry: CardRegistry<CardDefinition>,
  ) {}

  /**
   * Creates a new CardQuery builder
   * @template TGameState - The game state type
   * @param state - Game state containing cards
   * @param registry - Card definition registry
   * @returns New CardQuery instance
   */
  static create<
    TGameState extends { cards: Record<string, CardInstance<any>> },
  >(
    state: TGameState,
    registry: CardRegistry<CardDefinition>,
  ): CardQuery<TGameState> {
    return new CardQuery(state, registry);
  }

  /**
   * Filter by zone(s)
   * @param zone - Single zone or array of zones
   * @returns this for chaining
   */
  inZone(zone: ZoneId | ZoneId[]): this {
    this.filter.zone = zone;
    return this;
  }

  /**
   * Filter by owner(s)
   * @param owner - Single owner or array of owners
   * @returns this for chaining
   */
  ownedBy(owner: PlayerId | PlayerId[]): this {
    this.filter.owner = owner;
    return this;
  }

  /**
   * Filter by controller(s)
   * @param controller - Single controller or array of controllers
   * @returns this for chaining
   */
  controlledBy(controller: PlayerId | PlayerId[]): this {
    this.filter.controller = controller;
    return this;
  }

  /**
   * Filter by card type(s)
   * @param type - Single type or array of types
   * @returns this for chaining
   */
  ofType(type: string | string[]): this {
    this.filter.type = type;
    return this;
  }

  /**
   * Filter by exact card name
   * @param name - Card name
   * @returns this for chaining
   */
  withName(name: string): this {
    this.filter.name = name;
    return this;
  }

  /**
   * Filter by name pattern
   * @param pattern - RegExp pattern to match
   * @returns this for chaining
   */
  withNameMatching(pattern: RegExp): this {
    this.filter.name = pattern;
    return this;
  }

  /**
   * Filter by a generic card property from the definition
   * Works for any game-specific property:
   * - MTG: .withProperty("basePower", { gte: 3 })
   * - Pokemon: .withProperty("hp", { gte: 100 })
   * - Lorcana: .withProperty("inkCost", { lte: 3 })
   * @param propertyName - Name of the property on the card definition
   * @param filter - Filter to apply to the property value
   * @returns this for chaining
   */
  withProperty(propertyName: string, filter: PropertyFilter): this {
    if (!this.filter.properties) {
      this.filter.properties = {};
    }
    this.filter.properties[propertyName] = filter;
    return this;
  }

  /**
   * Filter for tapped/exhausted cards
   * @returns this for chaining
   */
  tapped(): this {
    this.filter.tapped = true;
    return this;
  }

  /**
   * Filter for untapped cards
   * @returns this for chaining
   */
  untapped(): this {
    this.filter.tapped = false;
    return this;
  }

  /**
   * Filter for revealed cards
   * @returns this for chaining
   */
  revealed(): this {
    this.filter.revealed = true;
    return this;
  }

  /**
   * Filter for non-revealed cards
   * @returns this for chaining
   */
  notRevealed(): this {
    this.filter.revealed = false;
    return this;
  }

  /**
   * Filter for flipped/face-down cards
   * @returns this for chaining
   */
  flipped(): this {
    this.filter.flipped = true;
    return this;
  }

  /**
   * Filter for face-up cards
   * @returns this for chaining
   */
  faceUp(): this {
    this.filter.flipped = false;
    return this;
  }

  /**
   * Filter for phased cards
   * @returns this for chaining
   */
  phased(): this {
    this.filter.phased = true;
    return this;
  }

  /**
   * Filter for non-phased cards
   * @returns this for chaining
   */
  notPhased(): this {
    this.filter.phased = false;
    return this;
  }

  /**
   * Add AND composite filter
   * @param filters - Array of filters that must all match
   * @returns this for chaining
   */
  and(filters: CardFilter<TGameState>[]): this {
    this.filter.and = filters;
    return this;
  }

  /**
   * Add OR composite filter
   * @param filters - Array of filters where at least one must match
   * @returns this for chaining
   */
  or(filters: CardFilter<TGameState>[]): this {
    this.filter.or = filters;
    return this;
  }

  /**
   * Add NOT filter
   * @param filter - Filter that must not match
   * @returns this for chaining
   */
  not(filter: CardFilter<TGameState>): this {
    this.filter.not = filter;
    return this;
  }

  /**
   * Add custom predicate filter
   * @param predicate - Custom filter function
   * @returns this for chaining
   */
  where(
    predicate: TGameState extends { cards: Record<string, infer TCard> }
      ? (card: TCard, state: TGameState) => boolean
      : (card: CardInstance<unknown>, state: TGameState) => boolean,
  ): this {
    this.filter.where = predicate;
    return this;
  }

  /**
   * Execute the query and return matching cards
   * @returns Array of matching cards
   */
  execute(): TGameState["cards"][string][] {
    return selectCards(this.state, this.filter, this.registry);
  }

  /**
   * Count the number of matching cards
   * @returns Number of cards that match the filter
   */
  count(): number {
    return countCards(this.state, this.filter, this.registry);
  }

  /**
   * Check if any card matches the filter
   * @returns true if at least one card matches
   */
  any(): boolean {
    return anyCard(this.state, this.filter, this.registry);
  }

  /**
   * Get the first matching card
   * @returns First matching card or undefined if none match
   */
  first(): TGameState["cards"][string] | undefined {
    const results = this.execute();
    return results[0];
  }

  /**
   * Get the current filter being built (for debugging/testing)
   * @returns Current CardFilter
   */
  getFilter(): CardFilter<TGameState> {
    return this.filter;
  }
}
