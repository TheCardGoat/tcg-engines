/**
 * CardFilterBuilder - Fluent API for Building Card Filters
 *
 * Optional convenience utility for building card filters with a fluent/builder API.
 * All methods return a new builder instance (immutable pattern).
 * The build() method produces a plain JSON CardFilter object.
 */

import type {
  BaseCoreCardFilter,
  NumericComparison,
  NumericRange,
  StringComparison,
} from "../types/game-specific-types";

/**
 * Fluent builder for creating card filters
 * Immutable - each method returns a new builder instance
 */
export class CardFilterBuilder<
  Filter extends BaseCoreCardFilter = BaseCoreCardFilter,
> {
  protected readonly filter: Partial<Filter>;

  constructor(initialFilter: Partial<Filter> = {}) {
    this.filter = { ...initialFilter };
  }

  /**
   * Set zone filter (single zone)
   */
  inZone(zone: string): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      zone,
    } as Partial<Filter>);
  }

  /**
   * Set zone filter (multiple zones)
   */
  inZones(zones: readonly string[]): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      zone: zones,
    } as Partial<Filter>);
  }

  /**
   * Set owner filter
   */
  controlledBy(owner: "self" | "opponent" | string): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      owner,
    } as Partial<Filter>);
  }

  /**
   * Set type filter (single type)
   */
  ofType(type: string): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      type,
    } as Partial<Filter>);
  }

  /**
   * Set type filter (multiple types)
   */
  ofTypes(types: readonly string[]): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      type: types,
    } as Partial<Filter>);
  }

  /**
   * Set ready status filter
   */
  ready(value = true): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      ready: value,
    } as Partial<Filter>);
  }

  /**
   * Set exerted status filter
   */
  exerted(value = true): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      exerted: value,
    } as Partial<Filter>);
  }

  /**
   * Set damaged status filter
   */
  damaged(value = true): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      damaged: value,
    } as Partial<Filter>);
  }

  /**
   * Set cost filter with comparison
   */
  withCost(
    operator: NumericComparison["operator"],
    value: number,
  ): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      cost: { operator, value },
    } as Partial<Filter>);
  }

  /**
   * Set cost range filter (legacy format)
   */
  withCostRange(min?: number, max?: number): CardFilterBuilder<Filter> {
    const range: NumericRange = {};
    if (min !== undefined) range.min = min;
    if (max !== undefined) range.max = max;

    return new CardFilterBuilder<Filter>({
      ...this.filter,
      cost: range,
    } as Partial<Filter>);
  }

  /**
   * Set exact cost filter (legacy format)
   */
  withExactCost(exact: number): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      cost: { exact },
    } as Partial<Filter>);
  }

  /**
   * Set strength filter with comparison
   */
  withStrength(
    operator: NumericComparison["operator"],
    value: number,
  ): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      strength: { operator, value },
    } as Partial<Filter>);
  }

  /**
   * Set name filter with comparison
   */
  named(
    operator: StringComparison["operator"],
    value: string | readonly string[],
    caseInsensitive?: boolean,
  ): CardFilterBuilder<Filter> {
    const nameFilter: StringComparison = { operator, value };
    if (caseInsensitive) {
      nameFilter.caseInsensitive = true;
    }

    return new CardFilterBuilder<Filter>({
      ...this.filter,
      name: nameFilter,
    } as Partial<Filter>);
  }

  /**
   * Set keyword filter (single keyword)
   */
  withKeyword(keyword: string): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      withKeyword: keyword,
    } as Partial<Filter>);
  }

  /**
   * Set keyword filter (multiple keywords)
   */
  withKeywords(keywords: readonly string[]): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      withKeyword: keywords,
    } as Partial<Filter>);
  }

  /**
   * Set keyword exclusion filter (single keyword)
   */
  withoutKeyword(keyword: string): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      withoutKeyword: keyword,
    } as Partial<Filter>);
  }

  /**
   * Set keyword exclusion filter (multiple keywords)
   */
  withoutKeywords(keywords: readonly string[]): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      withoutKeyword: keywords,
    } as Partial<Filter>);
  }

  /**
   * Set characteristic filter (single)
   */
  withCharacteristic(characteristic: string): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      withCharacteristics: [characteristic],
    } as Partial<Filter>);
  }

  /**
   * Set characteristics filter with ANY mode (default)
   */
  withCharacteristics(
    characteristics: readonly string[],
  ): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      withCharacteristics: characteristics,
    } as Partial<Filter>);
  }

  /**
   * Set characteristics filter with ALL mode
   */
  withAllCharacteristics(
    characteristics: readonly string[],
  ): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      withCharacteristics: characteristics,
      characteristicsMode: "all",
    } as Partial<Filter>);
  }

  /**
   * Set exact count
   */
  count(count: number): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      count,
    } as Partial<Filter>);
  }

  /**
   * Set count to "all"
   */
  all(): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      count: "all",
    } as Partial<Filter>);
  }

  /**
   * Set "up to N" count
   */
  upTo(count: number): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      count,
      upTo: true,
    } as Partial<Filter>);
  }

  /**
   * Set random selection
   */
  random(count: number): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      count,
      random: true,
    } as Partial<Filter>);
  }

  /**
   * Set excludeSelf flag
   */
  excludeSelf(): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      excludeSelf: true,
    } as Partial<Filter>);
  }

  /**
   * Set publicId filter
   */
  withPublicId(publicId: string): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      publicId,
    } as Partial<Filter>);
  }

  /**
   * Set instanceId filter
   */
  withInstanceId(instanceId: string): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      instanceId,
    } as Partial<Filter>);
  }

  /**
   * Set custom properties
   */
  withCustom(custom: Readonly<Record<string, any>>): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>({
      ...this.filter,
      custom,
    } as Partial<Filter>);
  }

  /**
   * Reset builder to empty state
   */
  reset(): CardFilterBuilder<Filter> {
    return new CardFilterBuilder<Filter>();
  }

  /**
   * Build the final filter object
   * Returns a plain JSON object
   */
  build(): Filter {
    return { ...this.filter } as Filter;
  }
}
