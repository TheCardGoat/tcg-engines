import type { GrandArchiveCardInstance } from "../../game/model.ts";
import { grandArchiveObjectFace } from "../../game/card-runtime.ts";
import { deriveGrandArchiveNumericProperty } from "../../rules/state/continuous.ts";
import type { GrandArchiveEvaluationContext } from "../effects/evaluation.ts";

export function grandArchiveSelectionNumericProperty(
  object: GrandArchiveCardInstance,
  property: "reserve-cost" | "memory-cost" | "power" | "life" | "level",
  basis: "base" | "current",
  evaluation: GrandArchiveEvaluationContext,
): number | undefined {
  if (basis === "current") return deriveGrandArchiveNumericProperty(object, property, evaluation);
  const face = grandArchiveObjectFace(evaluation.program, object);
  if (property === "reserve-cost" || property === "memory-cost") {
    const kind = property === "reserve-cost" ? "reserve" : "memory";
    return face.cost.kind === kind && typeof face.cost.amount === "number"
      ? face.cost.amount
      : undefined;
  }
  return face.stats[property];
}
