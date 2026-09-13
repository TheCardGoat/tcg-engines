import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom, FabRulesFacts } from "../../rules-view.ts";
import { cloneBase, cloneMutable } from "../mutable.ts";
import { contextFor, record, requireSingleTarget, type MutableObject } from "../atom-support.ts";

export function applyCopyAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
  atom: Extract<FabContinuousAtom, { kind: "copy" }>,
): void {
  const priorLife = subject.baseNumeric.life;
  if (atom.frozenSource) {
    subject.properties = cloneBase(atom.frozenSource);
    subject.baseNumeric = { ...atom.frozenSource.numeric };
  } else {
    const source = requireSingleTarget(
      atom.source,
      contextFor(entry, facts),
      objects,
      "copy source",
    );
    subject.properties = cloneMutable(source.properties);
    subject.baseNumeric = { ...source.baseNumeric };
  }
  if (atom.except === "base-life") {
    if (priorLife === undefined) delete subject.properties.numeric.life;
    else subject.properties.numeric.life = priorLife;
    subject.baseNumeric.life = priorLife;
  }
  record(subject, entry, "copyable-properties", "copy");
}
