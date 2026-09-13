import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom, FabRulesFacts } from "../../rules-view.ts";
import { contextFor, record, resolveTarget, type MutableObject } from "../atom-support.ts";

export function applyCopyAbilitiesAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  facts: FabRulesFacts,
  atom: Extract<FabContinuousAtom, { kind: "copy-abilities" }>,
): void {
  const sources = resolveTarget(atom.source, contextFor(entry, facts), objects);
  for (const source of sources) {
    for (const ability of source.properties.abilities) {
      if (subject.properties.abilities.some((candidate) => candidate.id === ability.id)) {
        continue;
      }
      subject.properties.abilities.push(ability);
      subject.added.abilities.set(ability.id, entry.effectId);
    }
  }
  record(subject, entry, "abilities", "copy");
}
