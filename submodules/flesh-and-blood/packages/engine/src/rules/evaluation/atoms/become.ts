import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom, FabRulesFacts } from "../../rules-view.ts";
import { cloneBase } from "../mutable.ts";
import { contextFor, evaluateAmount, record, type MutableObject } from "../atom-support.ts";

export function applyBecomeAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
  atom: Extract<FabContinuousAtom, { kind: "become" }>,
): void {
  const priorLife = subject.baseNumeric.life;
  if (atom.frozenSource) {
    subject.properties = cloneBase(atom.frozenSource);
    subject.baseNumeric = { ...atom.frozenSource.numeric };
    if (atom.except === "base-life") {
      if (priorLife === undefined) delete subject.properties.numeric.life;
      else subject.properties.numeric.life = priorLife;
      subject.baseNumeric.life = priorLife;
    }
    record(subject, entry, "copyable-properties", "become");
    return;
  }
  if (atom.filter) {
    subject.properties.types = ["Token"];
    subject.properties.subtypes = atom.source === "ally" ? ["Ally"] : [];
  }
  if (atom.basePower !== null) {
    subject.baseNumeric.power = evaluateAmount(atom.basePower, contextFor(entry, facts), objects);
    subject.properties.numeric.power = subject.baseNumeric.power;
  }
  if (atom.baseLife !== null) {
    subject.baseNumeric.life = evaluateAmount(atom.baseLife, contextFor(entry, facts), objects);
    subject.properties.numeric.life = subject.baseNumeric.life;
  }
  record(subject, entry, "copyable-properties", "become");
}
