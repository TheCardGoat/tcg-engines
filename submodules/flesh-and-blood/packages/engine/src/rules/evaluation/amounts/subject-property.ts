import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import { refKey, subjectPropertyBindingKey, type MutableObject } from "../helpers.ts";

export function evaluateSubjectProperty(
  amount: Exclude<FabAmount, number> & { type: "subject-property" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  const subjectRef = context.subject ?? context.source;
  const subject = subjectRef ? objects.get(refKey(subjectRef)) : undefined;
  const locked = subjectRef
    ? context.bindings.numbers[subjectPropertyBindingKey(subjectRef, amount)]
    : undefined;
  if (locked !== undefined) return locked;
  const value =
    amount.basis === "base"
      ? subject?.baseNumeric[amount.property]
      : subject?.properties.numeric[amount.property];
  if (value !== undefined) return value;
  if (amount.missing === "zero") return 0;
  throw new FabRulesEvaluationError(`subject missing ${amount.basis} ${amount.property}`);
}
