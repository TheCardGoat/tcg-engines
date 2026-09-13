import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import { refKey, requireBoundNumber, type MutableObject } from "../helpers.ts";

/** Number bindings with a per-chooser keyed form (`<binding>:<playerId>`)
 * that a for-each iteration resolves through `iteration-subject`. */
const PER_SUBJECT_NUMBER_BINDINGS = new Set(["chosen-number", "chose-highest-number"]);

export function evaluateReference(
  amount: Exclude<FabAmount, number> & { type: "reference" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  if (!amount.property) {
    if (PER_SUBJECT_NUMBER_BINDINGS.has(amount.binding)) {
      const subject = context.bindings.strings["iteration-subject"];
      if (subject) {
        const keyed = context.bindings.numbers[`${amount.binding}:${subject}`];
        if (keyed !== undefined) return keyed;
      }
    }
    if (amount.missing === "zero" && context.bindings.numbers[amount.binding] === undefined) {
      return 0;
    }
    return requireBoundNumber(amount.binding, context);
  }
  const ref = context.bindings.objects[amount.binding]?.[0];
  const value = ref ? objects.get(refKey(ref))?.properties.numeric[amount.property] : undefined;
  if (value !== undefined) return value;
  if (amount.missing === "zero") return 0;
  throw new FabRulesEvaluationError(
    `missing numeric property ${amount.property} on ${amount.binding}`,
  );
}
