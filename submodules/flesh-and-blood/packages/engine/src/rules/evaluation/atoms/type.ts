import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom } from "../../rules-view.ts";
import { assertVocabulary, record, removeValue, type MutableObject } from "../atom-support.ts";

export function applyTypeAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  atom: Extract<FabContinuousAtom, { kind: "type" }>,
): void {
  applyType(entry, subject, atom.property.kind, atom.property.value, atom.operation);
}

function applyType(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  kind: "type" | "subtype",
  value: string,
  operation: "grant" | "remove",
): void {
  const additions = kind === "type" ? subject.added.types : subject.added.subtypes;
  if (operation === "grant") {
    if (kind === "type") {
      const exact = assertVocabulary("type", value);
      if (!subject.properties.types.includes(exact)) subject.properties.types.push(exact);
    } else {
      const exact = assertVocabulary("subtype", value);
      if (!subject.properties.subtypes.includes(exact)) subject.properties.subtypes.push(exact);
    }
    additions.set(value, entry.effectId);
  } else if (!additions.has(value)) {
    if (kind === "type") removeValue(subject.properties.types, value);
    else removeValue(subject.properties.subtypes, value);
  }
  record(subject, entry, `${kind}:${value}`, operation);
}
