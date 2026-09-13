import { isFabAmount, type FabSelectionCount } from "@tcg/flesh-and-blood-types";
import type { FabRulesStackLayer } from "../layers.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import { conditionHolds, resolveLayerAmount } from "./shared.ts";

/** Sentinel for printed "repeat this process" until a stop condition. */
export const STAR_REPEAT_UNTIL = 100;

export function isStarRepeatTimes(times: unknown): boolean {
  return (
    typeof times === "object" &&
    times !== null &&
    "type" in times &&
    (times as { type: string }).type === "all"
  );
}

/** Resolve repeat.times for constants, until-loops, and conditional {then,else} amounts. */
export function resolveRepeatTimes(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  times: unknown,
  until?: unknown,
): number | null {
  if (times === undefined && until !== undefined) return STAR_REPEAT_UNTIL;
  if (typeof times === "number") {
    return Number.isInteger(times) && times >= 0 && times <= 100 ? times : null;
  }
  if (isStarRepeatTimes(times)) return STAR_REPEAT_UNTIL;
  if (
    times &&
    typeof times === "object" &&
    "type" in times &&
    (times as { type: string }).type === "conditional"
  ) {
    const conditional = times as {
      type: "conditional";
      condition: Parameters<typeof conditionHolds>[2];
      then: number | object;
      else?: number | object;
    };
    const branch = conditionHolds(state, layer, conditional.condition)
      ? conditional.then
      : conditional.else;
    return typeof branch === "number" && Number.isInteger(branch) && branch >= 0 && branch <= 100
      ? branch
      : resolveRepeatTimes(state, layer, branch, until);
  }
  if (isFabAmount(times as FabSelectionCount)) {
    const resolved = resolveLayerAmount(state, layer, times as FabSelectionCount);
    if (resolved === null || !Number.isFinite(resolved) || resolved < 0) return null;
    const n = Math.floor(resolved);
    return n <= 100 ? n : null;
  }
  return null;
}
