import type { FabContinuousAtom, FabEvaluatedContribution } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom, FabRulesFacts } from "../../rules-view.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import {
  acceptedApplicationForSubject,
  contextWithApplicationBindings,
  evaluateAmount,
  lockSubjectPropertyAmounts,
  record,
  refKey,
  type MutableObject,
} from "../atom-support.ts";
import { assertNever } from "../assert-never.ts";

export function applyNumericAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
  applicationMode: "desired" | "accepted",
  atom: Extract<FabContinuousAtom, { kind: "numeric" }>,
): void {
  const existing = acceptedApplicationForSubject(entry, subject);
  const context = contextWithApplicationBindings(entry, facts, subject.input.ref, existing);
  const amount = evaluateAmount(atom.amount, context, objects);
  const lockedBindings = lockSubjectPropertyAmounts(
    atom.amount,
    context,
    subject,
    objects,
    existing?.lockedBindings,
  );
  const current = subject.properties.numeric[atom.property];
  switch (atom.operation) {
    case "add-property":
      if (current === undefined) subject.properties.numeric[atom.property] = amount;
      break;
    case "remove-property":
      delete subject.properties.numeric[atom.property];
      break;
    case "set":
      // Characteristic-defining "this card's {p} is equal to…" (Rockyard Rodeo,
      // Mutated Mass) must install the property when the printed value is `*`.
      subject.properties.numeric[atom.property] = amount;
      break;
    case "multiply":
      if (current !== undefined) subject.properties.numeric[atom.property] = current * amount;
      break;
    case "divide":
      if (amount === 0) throw new FabRulesEvaluationError("division by zero");
      // CR-style divide: amount is the divisor. Default floor (Kayo "rounded
      // down"); `rounding: "up"` is Lyath "halved, rounded up" / Walk in My Shoes.
      if (current !== undefined) {
        const quotient = current / amount;
        subject.properties.numeric[atom.property] =
          atom.rounding === "up" ? Math.ceil(quotient) : Math.floor(quotient);
      }
      break;
    case "add":
      subject.properties.numeric[atom.property] = (current ?? 0) + amount;
      break;
    case "subtract": {
      const next = (current ?? 0) - amount;
      // CR 2.2.4 / 1.14: a card's resource cost cannot be reduced below 0.
      subject.properties.numeric[atom.property] =
        atom.property === "cost" ? Math.max(0, next) : next;
      break;
    }
    default:
      assertNever(atom.operation, "numeric.operation");
  }
  const value = subject.properties.numeric[atom.property];
  const desiredContribution: FabEvaluatedContribution = {
    kind: "numeric",
    property: atom.property,
    operation: atom.operation,
    value: value ?? null,
    previousValue: current ?? null,
    delta: current === undefined || value === undefined ? null : value - current,
    propertyPresent: value !== undefined,
  };
  const accepted = entry.acceptedApplications.find(
    (application) =>
      application.subject.kind === "object" &&
      refKey(application.subject.ref) === refKey(subject.input.ref) &&
      (applicationMode === "accepted" ||
        application.fingerprint === JSON.stringify(desiredContribution)),
  );
  if (accepted?.contribution.kind === "numeric") {
    if (accepted.contribution.propertyPresent && accepted.contribution.value !== null) {
      subject.properties.numeric[atom.property] = accepted.contribution.value;
    } else {
      delete subject.properties.numeric[atom.property];
    }
  }
  record(
    subject,
    entry,
    atom.property,
    atom.operation,
    accepted?.contribution ?? desiredContribution,
    accepted?.fingerprint,
    lockedBindings,
  );
}
