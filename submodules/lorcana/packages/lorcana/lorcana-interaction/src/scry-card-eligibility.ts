import type { CardFilter, ComparisonOperator } from "@tcg/lorcana-types";
import type { ResolutionSelectionRevealedCard } from "@tcg/lorcana-engine";

/**
 * Filter predicate evaluator scoped to scry card placement legality.
 *
 * The engine validates the *full* `CardFilter` discriminated union at
 * submission time. The view layer only needs to surface a hint to the
 * renderer: "is this card a legal candidate for this destination?".
 *
 * We evaluate the subset of filter shapes that depend solely on data the
 * view layer carries on `ResolutionSelectionRevealedCard` (cardType, cost,
 * classifications, actionSubtype). Filters that depend on runtime state the
 * view does not project (status, zone, exertion, attached source, etc.)
 * default to `true` so the renderer never *under-highlights* a card the
 * engine would actually accept.
 */

type RevealedLike = Pick<
  ResolutionSelectionRevealedCard,
  "cardId" | "cardType" | "actionSubtype" | "cost" | "classifications"
>;

function compare(value: number, comparison: ComparisonOperator, threshold: number): boolean {
  switch (comparison) {
    case "lt":
    case "less":
    case "less-than":
      return value < threshold;
    case "lte":
    case "less-or-equal":
    case "or-less":
      return value <= threshold;
    case "eq":
    case "equal":
      return value === threshold;
    case "ne":
    case "not-equal":
      return value !== threshold;
    case "gte":
    case "greater-or-equal":
    case "or-more":
      return value >= threshold;
    case "gt":
    case "greater":
    case "greater-than":
    case "more-than":
      return value > threshold;
  }
}

function matchesSingleFilter(filter: CardFilter, card: RevealedLike): boolean {
  switch (filter.type) {
    case "card-type":
      return card.cardType === (filter.cardType ?? filter.value);
    case "cost":
      if (typeof card.cost !== "number" || typeof filter.value !== "number") {
        return true;
      }
      return compare(card.cost, filter.comparison, filter.value);
    case "has-classification":
      return (card.classifications ?? []).includes(filter.classification);
    case "song":
      return card.actionSubtype === "song";
    case "and":
      return filter.filters.every((f) => matchesSingleFilter(f, card));
    case "or":
      return filter.filters.some((f) => matchesSingleFilter(f, card));
    case "not":
      return !matchesSingleFilter(filter.filter, card);
    default:
      // Filter depends on data not projected to the view (status/zone/owner/
      // exertion/source/etc). Treat as a match so the renderer doesn't hide
      // a card the engine would legally accept; engine validates at submit.
      return true;
  }
}

export function revealedCardMatchesScryFilters(
  filters: readonly CardFilter[] | undefined,
  card: RevealedLike,
): boolean {
  if (!filters || filters.length === 0) {
    return true;
  }
  return filters.every((filter) => matchesSingleFilter(filter, card));
}
