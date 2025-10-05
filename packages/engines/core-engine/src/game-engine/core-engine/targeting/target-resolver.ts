/**
 * TargetResolver - Runtime Filter Evaluation
 *
 * Resolves serialized target filters to actual card instances at runtime.
 * Handles all enhanced filter properties with immutable data patterns.
 */

import type { CoreCardInstance } from "../card/core-card-instance";
import type { CoreCardInstanceStore } from "../card/core-card-instance-store";
import type {
  BaseCoreCardFilter,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  NumericComparison,
  NumericRange,
  StringComparison,
} from "../types/game-specific-types";
import {
  BuiltInSecurityRules,
  SecurityRuleRegistry,
} from "./security-rule-registry";
import type { SecurityContext } from "./types";

/**
 * Context for target resolution
 */
export type TargetContext = SecurityContext;

/**
 * Resolves serialized target filters to actual card instances
 * This is where filter evaluation happens at runtime
 */
export class TargetResolver<
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardInstance extends
    CoreCardInstance<any> = CoreCardInstance<GameSpecificCardDefinition>,
> {
  private readonly securityRegistry: SecurityRuleRegistry<CardInstance>;

  constructor(
    private readonly state: any, // Game state (not currently used, reserved for future)
    private readonly cardStore: CoreCardInstanceStore<any>,
    securityRegistry?: SecurityRuleRegistry<CardInstance>,
  ) {
    // Initialize security registry with built-in rules
    this.securityRegistry =
      securityRegistry || new SecurityRuleRegistry<CardInstance>();

    // Register Ward protection by default if no registry provided
    if (!securityRegistry) {
      this.securityRegistry.registerRule(
        BuiltInSecurityRules.createWardRule<CardInstance>(),
      );
    }
  }

  /**
   * Get the security rule registry (for adding game-specific rules)
   */
  getSecurityRegistry(): SecurityRuleRegistry<CardInstance> {
    return this.securityRegistry;
  }

  /**
   * Resolve a card filter to matching card instances
   * Returns immutable array of matching cards
   */
  resolveCardTargets(
    filter: CardFilter,
    sourceCard?: CardInstance,
    context?: TargetContext,
  ): CardInstance[] {
    // 1. Get candidate pool
    let candidates = this.getCandidatePool(filter);

    // 2. Apply filters sequentially (short-circuit on expensive checks)
    candidates = this.applyZoneFilter(candidates, filter);
    candidates = this.applyOwnerFilter(candidates, filter, sourceCard);
    candidates = this.applyTypeFilter(candidates, filter);
    candidates = this.applyPublicIdFilter(candidates, filter);
    candidates = this.applyInstanceIdFilter(candidates, filter);

    // Status filters
    candidates = this.applyStatusFilters(candidates, filter);

    // Attribute comparisons (potentially expensive)
    candidates = this.applyAttributeFilters(candidates, filter);

    // Keyword/ability filters
    candidates = this.applyKeywordFilters(candidates, filter);

    // Characteristics filters
    candidates = this.applyCharacteristicsFilters(candidates, filter);

    // ExcludeSelf
    candidates = this.applyExcludeSelfFilter(candidates, filter, sourceCard);

    // Security checks (Ward, protection abilities)
    // Skip for "all" effects - they bypass targeting restrictions
    if (filter.count !== "all") {
      candidates = this.applySecurityChecks(candidates, sourceCard, context);
    }

    // 3. Apply quantity rules
    return this.applyQuantityRules(candidates, filter);
  }

  /**
   * Get initial candidate pool from card store
   */
  private getCandidatePool(filter: CardFilter): CardInstance[] {
    return this.cardStore.getAllCards() as CardInstance[];
  }

  /**
   * Filter by zone (single or multiple)
   */
  private applyZoneFilter(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    if (!filter.zone) {
      return candidates;
    }

    const zones = Array.isArray(filter.zone) ? filter.zone : [filter.zone];
    return candidates.filter((card) => zones.includes(card.zone));
  }

  /**
   * Filter by owner (supports "self", "opponent", or specific player ID)
   */
  private applyOwnerFilter(
    candidates: CardInstance[],
    filter: CardFilter,
    sourceCard?: CardInstance | undefined,
  ): CardInstance[] {
    if (!filter.owner) {
      return candidates;
    }

    if (filter.owner === "self" && sourceCard) {
      return candidates.filter((card) => card.owner === sourceCard.owner);
    }

    if (filter.owner === "opponent" && sourceCard) {
      return candidates.filter((card) => card.owner !== sourceCard.owner);
    }

    // Specific player ID
    return candidates.filter((card) => card.owner === filter.owner);
  }

  /**
   * Filter by card type (single or multiple)
   */
  private applyTypeFilter(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    if (!filter.type) {
      return candidates;
    }

    const types = Array.isArray(filter.type) ? filter.type : [filter.type];
    return candidates.filter((card) => {
      const cardType = (card.card as any).type;
      return types.includes(cardType);
    });
  }

  /**
   * Filter by publicId
   */
  private applyPublicIdFilter(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    if (!filter.publicId) {
      return candidates;
    }

    return candidates.filter((card) => card.publicId === filter.publicId);
  }

  /**
   * Filter by instanceId
   */
  private applyInstanceIdFilter(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    if (!filter.instanceId) {
      return candidates;
    }

    return candidates.filter((card) => card.instanceId === filter.instanceId);
  }

  /**
   * Apply status filters (ready, exerted, damaged)
   */
  private applyStatusFilters(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    let result = candidates;

    if (filter.ready !== undefined) {
      result = result.filter((card) => {
        const ready = (card.meta as any)?.ready;
        return ready === filter.ready;
      });
    }

    if (filter.exerted !== undefined) {
      result = result.filter((card) => {
        const exerted = (card.meta as any)?.exerted;
        return exerted === filter.exerted;
      });
    }

    if (filter.damaged !== undefined) {
      result = result.filter((card) => {
        const damaged = (card.meta as any)?.damaged;
        return damaged === filter.damaged;
      });
    }

    return result;
  }

  /**
   * Apply attribute comparison filters (cost, strength, name)
   */
  private applyAttributeFilters(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    let result = candidates;

    // Cost filter
    if (filter.cost) {
      result = result.filter((card) => {
        const cardCost = (card.card as any).cost;
        if (cardCost === undefined) return false;
        // biome-ignore lint/style/noNonNullAssertion: filter.cost is guaranteed to exist here
        return this.matchesNumericFilter(cardCost, filter.cost!);
      });
    }

    // Strength filter
    if (filter.strength) {
      result = result.filter((card) => {
        const cardStrength = (card.card as any).strength;
        if (cardStrength === undefined) return false;
        // biome-ignore lint/style/noNonNullAssertion: filter.strength is guaranteed to exist here
        return this.matchesNumericFilter(cardStrength, filter.strength!);
      });
    }

    // Name filter (StringComparison)
    if (filter.name) {
      result = result.filter((card) => {
        const cardName = (card.card as any).name;
        if (!cardName) return false;
        // biome-ignore lint/style/noNonNullAssertion: filter.name is guaranteed to exist here
        return this.matchesStringFilter(cardName, filter.name!);
      });
    }

    return result;
  }

  /**
   * Check if a numeric value matches a filter (supports both formats)
   */
  private matchesNumericFilter(
    value: number,
    filterValue: NumericComparison | NumericRange,
  ): boolean {
    // Check if it's NumericComparison (has operator and value)
    if ("operator" in filterValue && "value" in filterValue) {
      const comparison = filterValue as NumericComparison;
      switch (comparison.operator) {
        case "eq":
          return value === comparison.value;
        case "gt":
          return value > comparison.value;
        case "gte":
          return value >= comparison.value;
        case "lt":
          return value < comparison.value;
        case "lte":
          return value <= comparison.value;
        default:
          return false;
      }
    }

    // Legacy NumericRange format
    const range = filterValue as NumericRange;
    if (range.exact !== undefined) {
      return value === range.exact;
    }
    if (range.min !== undefined && value < range.min) {
      return false;
    }
    if (range.max !== undefined && value > range.max) {
      return false;
    }
    return true;
  }

  /**
   * Check if a string value matches a filter
   */
  private matchesStringFilter(
    value: string,
    filter: StringComparison,
  ): boolean {
    const compareValue = filter.caseInsensitive ? value.toLowerCase() : value;
    const filterValues = Array.isArray(filter.value)
      ? filter.value
      : [filter.value];

    const normalizedFilterValues = filter.caseInsensitive
      ? filterValues.map((v) => v.toLowerCase())
      : filterValues;

    switch (filter.operator) {
      case "eq":
        return normalizedFilterValues.includes(compareValue);
      case "includes":
        return normalizedFilterValues.some((fv) => compareValue.includes(fv));
      case "startsWith":
        return normalizedFilterValues.some((fv) => compareValue.startsWith(fv));
      case "endsWith":
        return normalizedFilterValues.some((fv) => compareValue.endsWith(fv));
      default:
        return false;
    }
  }

  /**
   * Apply keyword filters (withKeyword, withoutKeyword)
   */
  private applyKeywordFilters(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    let result = candidates;

    if (filter.withKeyword) {
      const keywords = Array.isArray(filter.withKeyword)
        ? filter.withKeyword
        : [filter.withKeyword];

      result = result.filter((card) => {
        const cardKeywords = (card.card as any).keywords as
          | string[]
          | undefined;
        if (!cardKeywords) return false;
        return keywords.some((kw) => cardKeywords.includes(kw));
      });
    }

    if (filter.withoutKeyword) {
      const keywords = Array.isArray(filter.withoutKeyword)
        ? filter.withoutKeyword
        : [filter.withoutKeyword];

      result = result.filter((card) => {
        const cardKeywords = (card.card as any).keywords as
          | string[]
          | undefined;
        if (!cardKeywords) return true; // No keywords means doesn't have the excluded ones
        return !keywords.some((kw) => cardKeywords.includes(kw));
      });
    }

    return result;
  }

  /**
   * Apply characteristics filters with AND/OR logic
   */
  private applyCharacteristicsFilters(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    if (
      !filter.withCharacteristics ||
      filter.withCharacteristics.length === 0
    ) {
      return candidates;
    }

    const mode = filter.characteristicsMode || "any";

    return candidates.filter((card) => {
      const cardCharacteristics = (card.card as any).characteristics as
        | string[]
        | undefined;
      if (!cardCharacteristics) return false;

      if (mode === "all") {
        // AND logic - card must have ALL characteristics
        // biome-ignore lint/style/noNonNullAssertion: filter.withCharacteristics is guaranteed to exist here
        return filter.withCharacteristics!.every((ch) =>
          cardCharacteristics.includes(ch),
        );
      }

      // OR logic (default) - card must have ANY characteristic
      // biome-ignore lint/style/noNonNullAssertion: filter.withCharacteristics is guaranteed to exist here
      return filter.withCharacteristics!.some((ch) =>
        cardCharacteristics.includes(ch),
      );
    });
  }

  /**
   * Apply excludeSelf filter
   */
  private applyExcludeSelfFilter(
    candidates: CardInstance[],
    filter: CardFilter,
    sourceCard?: CardInstance,
  ): CardInstance[] {
    if (!filter.excludeSelf) {
      return candidates;
    }

    if (!sourceCard) {
      return candidates;
    }

    return candidates.filter(
      (card) => card.instanceId !== sourceCard.instanceId,
    );
  }

  /**
   * Apply security checks (Ward, protection abilities, etc.)
   * Filters out targets that are protected by security rules
   */
  private applySecurityChecks(
    candidates: CardInstance[],
    sourceCard?: CardInstance,
    context?: TargetContext,
  ): CardInstance[] {
    return candidates.filter((target) => {
      const validation = this.securityRegistry.validateTarget(
        target,
        sourceCard,
        context,
      );
      return validation.valid;
    });
  }

  /**
   * Apply quantity rules (count, upTo, random)
   * Returns immutable array
   */
  private applyQuantityRules(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    if (filter.count === "all") {
      return [...candidates]; // Return immutable copy
    }

    const count = filter.count ?? candidates.length;

    if (filter.random) {
      return this.selectRandom(candidates, count);
    }

    if (filter.upTo) {
      // "Up to N" - return up to count, but could be less
      return candidates.slice(0, Math.min(count, candidates.length));
    }

    // Exact count
    return candidates.slice(0, count);
  }

  /**
   * Select random cards from candidates
   * Returns immutable array
   */
  private selectRandom(
    candidates: CardInstance[],
    count: number,
  ): CardInstance[] {
    if (candidates.length <= count) {
      return [...candidates];
    }

    // Fisher-Yates shuffle (immutable)
    const shuffled = [...candidates];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }
}
