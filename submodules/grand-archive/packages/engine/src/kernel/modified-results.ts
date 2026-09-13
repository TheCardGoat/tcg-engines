import type { GrandArchiveAmount, GrandArchiveEffect } from "@tcg/grand-archive-types";
import type { GrandArchiveCommittedEvent, GrandArchiveProposedEvent } from "./events.ts";

export type GrandArchiveModifiedResultMetric = Extract<
  GrandArchiveAmount,
  { readonly kind: "modified-ability-result-amount" }
>["metric"];

export function grandArchiveModifiedResultBinding(
  metric: GrandArchiveModifiedResultMetric,
): `modifiedResult:${GrandArchiveModifiedResultMetric}` {
  return `modifiedResult:${metric}`;
}

/** The one result family whose value this atomic instruction replaces. */
export function grandArchiveModifiedResultMetricForEffect(
  effect: GrandArchiveEffect,
): GrandArchiveModifiedResultMetric | undefined {
  switch (effect.kind) {
    case "draw":
    case "mill":
    case "reserve":
    case "discard":
    case "banish":
    case "banish-object":
    case "move":
    case "swap-zones":
      return "cards-moved";
    case "remove-counter":
    case "move-counter":
    case "move-counters-from-collection":
    case "remove-counters-from-collection":
      return "counters-removed";
    case "deal-damage":
      return "damage-dealt";
    case "sacrifice":
      return "objects-sacrificed";
    default:
      return undefined;
  }
}

/** Measures the post-replacement committed outcome of one instructed action. */
export function grandArchiveModifiedResultAmount(
  metric: GrandArchiveModifiedResultMetric,
  events: readonly (GrandArchiveCommittedEvent | GrandArchiveProposedEvent)[],
): number {
  switch (metric) {
    case "cards-moved":
      return events.filter((event) => event.type === "object-moved").length;
    case "counters-removed":
      return events.reduce(
        (total, event) =>
          total +
          ((event.type === "counter-changed" || event.type === "mastery-counter-changed") &&
          event.delta < 0
            ? -event.delta
            : 0),
        0,
      );
    case "damage-dealt":
      return events.reduce(
        (total, event) => total + (event.type === "damage-marked" ? event.amount : 0),
        0,
      );
    case "damage-prevented":
      return events.reduce(
        (total, event) => total + (event.type === "damage-prevented" ? event.amount : 0),
        0,
      );
    case "objects-sacrificed":
      return events.filter(
        (event) =>
          event.type === "object-moved" &&
          event.cause?.kind === "rule" &&
          event.cause.rule.includes("sacrifice"),
      ).length;
    default:
      return assertNever(metric);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive modified-result metric: ${String(value)}`);
}
