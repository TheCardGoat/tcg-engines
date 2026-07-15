import type { PlayerTargetDSL, TargetDSL } from "./target-dsl";
import type { TargetZone } from "../abilities/target-types";
import type {
  LorcanaCardTarget,
  LorcanaCardType,
  LorcanaContext,
  LorcanaFilter,
  LorcanaPlayerFilter,
} from "./lorcana-target-dsl";

export type LegacyTargetRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is LegacyTargetRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isDSLTarget(target: unknown): target is LorcanaCardTarget {
  return isRecord(target);
}

export function isLorcanaPlayerFilterRecord(value: unknown): value is LorcanaPlayerFilter {
  if (!isRecord(value) || typeof value.type !== "string") {
    return false;
  }

  switch (value.type) {
    case "lore":
      return (
        (value.comparison === "eq" ||
          value.comparison === "ne" ||
          value.comparison === "gt" ||
          value.comparison === "gte" ||
          value.comparison === "lt" ||
          value.comparison === "lte") &&
        typeof value.value === "number"
      );
    case "current-turn-player":
      return typeof value.value === "boolean";
    case "zone-count-rank":
      return (
        (value.zone === "deck" ||
          value.zone === "hand" ||
          value.zone === "play" ||
          value.zone === "discard" ||
          value.zone === "inkwell") &&
        (value.rank === undefined || value.rank === "highest") &&
        (value.ties === undefined || value.ties === "all") &&
        (value.minCount === undefined || typeof value.minCount === "number")
      );
    case "and":
    case "or":
      return Array.isArray(value.filters) && value.filters.every(isLorcanaPlayerFilterRecord);
    case "not":
      return isLorcanaPlayerFilterRecord(value.filter);
    default:
      return false;
  }
}

export function cloneCardTarget(target: LorcanaCardTarget): LorcanaCardTarget {
  return {
    ...target,
    zones: target.zones ? [...target.zones] : undefined,
    cardType: target.cardType,
    cardTypes: target.cardTypes ? [...target.cardTypes] : undefined,
    filters: target.filters ? [...target.filters] : undefined,
    context: target.context ? { ...target.context } : undefined,
    reference: target.reference,
  };
}

export function normalizeSelector(record: LegacyTargetRecord): TargetDSL["selector"] {
  const selector = record.selector;
  if (
    selector === undefined &&
    (typeof record.reference === "string" || typeof record.ref === "string")
  ) {
    // Reference-only targets reuse an earlier selection; they should not be treated as a fresh
    // "chosen" selector during preflight target analysis.
    return "self";
  }
  if (selector === "this") {
    return "self";
  }
  if (selector === "another" || selector === "other") {
    return "chosen";
  }
  if (
    selector === "self" ||
    selector === "chosen" ||
    selector === "all" ||
    selector === "each" ||
    selector === "any" ||
    selector === "random"
  ) {
    return selector;
  }
  return "chosen";
}

export function normalizeCount(record: LegacyTargetRecord): TargetDSL["count"] | undefined {
  if (record.selector === "each" && record.count === 1) {
    return "all";
  }

  return record.count as TargetDSL["count"] | undefined;
}

export function normalizeCardTargetRecord(record: LegacyTargetRecord): LorcanaCardTarget {
  const filterValues: LorcanaFilter[] = [];
  if (Array.isArray(record.filter)) {
    for (const filter of record.filter) {
      if (isRecord(filter)) {
        filterValues.push(filter as LorcanaFilter);
      }
    }
  } else if (isRecord(record.filter)) {
    filterValues.push(record.filter as LorcanaFilter);
  }
  if (Array.isArray(record.filters)) {
    for (const filter of record.filters) {
      if (isRecord(filter)) {
        filterValues.push(filter as LorcanaFilter);
      }
    }
  } else if (isRecord(record.filters)) {
    filterValues.push(record.filters as LorcanaFilter);
  }

  const cardTypes = Array.isArray(record.cardTypes)
    ? record.cardTypes.filter((value): value is LorcanaCardType => typeof value === "string")
    : typeof record.cardType === "string"
      ? [record.cardType as LorcanaCardType]
      : undefined;

  const zones = Array.isArray(record.zones)
    ? record.zones.filter((value): value is TargetZone => typeof value === "string")
    : undefined;

  const legacyRef = typeof record.ref === "string" ? record.ref : undefined;
  const normalizedReference =
    record.reference === "source" ||
    record.reference === "selected-first" ||
    record.reference === "selected-all" ||
    record.reference === "revealed-first" ||
    record.reference === "revealed-all" ||
    record.reference === "chosen-or-source" ||
    record.reference === "singers"
      ? record.reference
      : record.reference === "previous-target"
        ? "selected-first"
        : legacyRef === "previous-target"
          ? "selected-first"
          : legacyRef === "selected-all"
            ? "selected-all"
            : undefined;

  return {
    selector: normalizeSelector(record),
    count: normalizeCount(record),
    owner:
      record.owner === "you" || record.owner === "opponent" || record.owner === "any"
        ? record.owner
        : undefined,
    zones,
    cardTypes,
    filters: filterValues.length > 0 ? filterValues : undefined,
    context: isRecord(record.context) ? (record.context as LorcanaContext) : undefined,
    excludeSelf:
      record.excludeSelf === true || record.selector === "another" || record.selector === "other",
    excludeTriggerSubject: record.excludeTriggerSubject === true ? true : undefined,
    requireDifferentTargets:
      typeof record.requireDifferentTargets === "boolean"
        ? record.requireDifferentTargets
        : undefined,
    totalCostBudget:
      typeof record.totalCostBudget === "number" && Number.isFinite(record.totalCostBudget)
        ? record.totalCostBudget
        : undefined,
    totalStrengthBudget:
      typeof record.totalStrengthBudget === "number" && Number.isFinite(record.totalStrengthBudget)
        ? record.totalStrengthBudget
        : undefined,
    reference: normalizedReference,
  };
}

export function isPlayerTargetRecord(record: LegacyTargetRecord): boolean {
  if (record.reference !== undefined) {
    return false;
  }

  if (
    record.selector !== "you" &&
    record.selector !== "opponent" &&
    record.selector !== "each-player" &&
    record.selector !== "chosen"
  ) {
    return false;
  }

  return !Array.isArray(record.zones) && !Array.isArray(record.cardTypes) && !record.cardType;
}
