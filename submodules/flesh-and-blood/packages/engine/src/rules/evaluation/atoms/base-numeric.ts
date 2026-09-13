import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom, FabRulesFacts } from "../../rules-view.ts";
import {
  acceptedApplicationForSubject,
  contextWithApplicationBindings,
  evaluateAmount,
  lockSubjectPropertyAmounts,
  record,
  type MutableObject,
} from "../atom-support.ts";

export function applyBaseNumericAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
  atom: Extract<FabContinuousAtom, { kind: "base-numeric" }>,
): void {
  const accepted = acceptedApplicationForSubject(entry, subject);
  const context = contextWithApplicationBindings(entry, facts, subject.input.ref, accepted);
  const amount = evaluateAmount(atom.amount, context, objects);
  const lockedBindings = lockSubjectPropertyAmounts(
    atom.amount,
    context,
    subject,
    objects,
    accepted?.lockedBindings,
  );
  if (atom.operation === "remove-property") delete subject.baseNumeric[atom.property];
  else if (atom.operation === "add-property" && subject.baseNumeric[atom.property] === undefined)
    subject.baseNumeric[atom.property] = amount;
  else if (atom.operation === "set") subject.baseNumeric[atom.property] = amount;
  subject.properties.numeric = { ...subject.baseNumeric };
  record(
    subject,
    entry,
    `base-${atom.property}`,
    atom.operation,
    undefined,
    undefined,
    lockedBindings,
  );
}
