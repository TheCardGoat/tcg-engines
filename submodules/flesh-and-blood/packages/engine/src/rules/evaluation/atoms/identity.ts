import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom, FabEvaluatedRule } from "../../rules-view.ts";
import { isRestricted, record, type MutableObject } from "../atom-support.ts";

export function applyIdentityAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  rules: readonly FabEvaluatedRule[],
  atom: Extract<FabContinuousAtom, { kind: "identity" }>,
): void {
  if (
    atom.operation === "grant" &&
    atom.property.kind === "name" &&
    isRestricted("gain-name", subject, rules)
  ) {
    record(subject, entry, "name", "prevented");
    return;
  }
  applyIdentity(entry, subject, atom.property, atom.operation);
}

function applyIdentity(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  property: Extract<FabContinuousAtom, { kind: "identity" }>["property"],
  operation: "grant" | "remove",
): void {
  if (property.kind === "name") {
    if (operation === "grant" && !subject.properties.names.includes(property.value)) {
      subject.properties.names.push(property.value);
    } else if (operation === "remove") {
      // Catalog `*` is "all names" (Amnesia). A literal "*" name is not used.
      subject.properties.names =
        property.value === "*"
          ? []
          : subject.properties.names.filter((name) => name !== property.value);
    }
  } else
    subject.properties.color =
      operation === "grant" && property.value !== "chosen" && property.value !== "all"
        ? property.value
        : null;
  record(subject, entry, property.kind, operation);
}
