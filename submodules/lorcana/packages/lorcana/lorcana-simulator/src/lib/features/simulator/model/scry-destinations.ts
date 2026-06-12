import type { CardFilter, CardSelectionFilter, ScryCardOrdering } from "@tcg/lorcana-types";
import type { ResolutionSelectionDestinationRule } from "@tcg/lorcana-engine";
import type { LorcanaCardSnapshot } from "./contracts.js";

export interface ScryCardMatchInput {
  cardType?: LorcanaCardSnapshot["cardType"];
  actionSubtype?: LorcanaCardSnapshot["actionSubtype"];
  cost?: LorcanaCardSnapshot["cost"];
  classifications?: LorcanaCardSnapshot["classifications"];
}

type TypedCardFilter = Exclude<CardFilter, CardSelectionFilter>;

function hasFilterType(filter: CardFilter): filter is TypedCardFilter {
  return "type" in filter;
}

function evaluateNumericComparison(value: number, comparison: string, threshold: number): boolean {
  switch (comparison) {
    case "lte":
    case "less-or-equal":
    case "or-less":
      return value <= threshold;
    case "gte":
    case "greater-or-equal":
    case "or-more":
      return value >= threshold;
    case "lt":
    case "less":
    case "less-than":
      return value < threshold;
    case "gt":
    case "greater":
    case "greater-than":
    case "more-than":
      return value > threshold;
    case "eq":
    case "equal":
      return value === threshold;
    case "ne":
    case "not-equal":
      return value !== threshold;
    default:
      return true;
  }
}

function matchesSingleFilter(card: ScryCardMatchInput, filter: CardFilter): boolean {
  if (!hasFilterType(filter)) {
    if ("cardType" in filter && typeof filter.cardType === "string") {
      if (filter.cardType === "song") {
        if (!(card.cardType === "action" && card.actionSubtype === "song")) {
          return false;
        }
      } else if (card.cardType !== filter.cardType) {
        return false;
      }
    }

    if ("classification" in filter && typeof filter.classification === "string") {
      if (!(card.classifications ?? []).includes(filter.classification)) {
        return false;
      }
    }

    if ("maxCost" in filter && typeof filter.maxCost === "number") {
      if (typeof card.cost !== "number" || card.cost > filter.maxCost) {
        return false;
      }
    }

    return true;
  }

  const filterType = filter.type as string;
  if (filterType === "card-type") {
    const typedFilter = filter as { cardType?: ScryCardMatchInput["cardType"] };
    return card.cardType === typedFilter.cardType;
  }

  if (filterType === "classification") {
    const typedFilter = filter as { classification?: string };
    return typeof typedFilter.classification === "string"
      ? (card.classifications ?? []).includes(typedFilter.classification)
      : true;
  }

  switch (filter.type) {
    case "and":
      return filter.filters.every((entry) => matchesSingleFilter(card, entry));
    case "or":
      return filter.filters.some((entry) => matchesSingleFilter(card, entry));
    case "not":
      return !matchesSingleFilter(card, filter.filter);
    case "cost":
    case "cost-comparison":
      return typeof filter.value === "number"
        ? evaluateNumericComparison(card.cost ?? 0, filter.comparison, filter.value)
        : false;
    case "song":
      return card.cardType === "action" && card.actionSubtype === "song";
    default:
      return true;
  }
}

function matchesAllFilters(card: ScryCardMatchInput, filters: readonly CardFilter[]): boolean {
  return filters.length === 0 || filters.every((filter) => matchesSingleFilter(card, filter));
}

export function canAssignCardToScryDestination(
  card: ScryCardMatchInput,
  rule: ResolutionSelectionDestinationRule,
): boolean {
  return (
    matchesAllFilters(card, rule.filters ?? []) && matchesAllFilters(card, rule.playFilters ?? [])
  );
}

export function getScryZoneLabel(zone: string): string {
  switch (zone) {
    case "deck-top":
      return "Top of deck";
    case "deck-bottom":
      return "Bottom of deck";
    case "hand":
      return "Hand";
    case "play":
      return "Play";
    case "inkwell":
      return "Inkwell";
    case "discard":
      return "Discard";
    default:
      return zone;
  }
}

function getOrderingLabel(ordering: ScryCardOrdering | undefined): string | null {
  switch (ordering) {
    case "player-choice":
      return "any order";
    case "original-order":
      return "original order";
    case "random":
      return "random order";
    default:
      return null;
  }
}

export function getScryDestinationConstraintSummary(
  rule: ResolutionSelectionDestinationRule,
): string {
  const parts: string[] = [];

  if (rule.min > 0 && rule.max !== null && rule.min === rule.max) {
    parts.push(`exactly ${rule.min}`);
  } else if (rule.min > 0 && rule.max !== null) {
    parts.push(`${rule.min}-${rule.max}`);
  } else if (rule.min > 0) {
    parts.push(`at least ${rule.min}`);
  } else if (rule.max !== null) {
    parts.push(`up to ${rule.max}`);
  } else {
    parts.push("any number");
  }

  if (rule.remainder) {
    parts.push("remainder");
  }

  if (rule.zone === "play" && rule.cost === "free") {
    parts.push("play for free");
  }

  if (rule.zone === "inkwell") {
    const inkParts: string[] = [];
    if (rule.facedown !== false) inkParts.push("facedown");
    if (rule.exerted !== false) inkParts.push("exerted");
    if (inkParts.length > 0) {
      parts.push(inkParts.join(", "));
    }
  }

  const orderingLabel = getOrderingLabel(rule.ordering);
  if (orderingLabel) {
    parts.push(orderingLabel);
  }

  return parts.join(" • ");
}

export function isScryDestinationManuallyOrdered(
  rule: ResolutionSelectionDestinationRule,
): boolean {
  return (
    (rule.zone === "deck-top" || rule.zone === "deck-bottom") &&
    (rule.ordering === undefined || rule.ordering === "player-choice")
  );
}
