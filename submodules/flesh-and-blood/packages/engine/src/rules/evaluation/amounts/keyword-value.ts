import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import { refKey, type MutableObject } from "../helpers.ts";
import { evaluateAmount } from "../evaluate-amount.ts";

export function evaluateKeywordValue(
  amount: Exclude<FabAmount, number> & { type: "keyword-value" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  // Printed "base {p} equal to their ward" (Cosmo) is the *subject's* keyword
  // value, not the continuous effect source's. Prefer subject when present;
  // fall back to source for self-referential amounts (e.g. Ward X on the
  // card that carries the keyword).
  const hostRef = context.subject ?? context.source;
  const host = hostRef ? objects.get(refKey(hostRef)) : undefined;
  const keyword = host?.properties.keywords.find((candidate) => candidate.name === amount.keyword);
  if (!keyword || !("value" in keyword)) {
    throw new FabRulesEvaluationError(`keyword ${amount.keyword} has no numeric value`);
  }
  return evaluateAmount(keyword.value, context, objects);
}
