import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom, FabEvaluatedRule } from "../../rules-view.ts";
import { isRestricted, record, type MutableObject } from "../atom-support.ts";

export function applyAbilityAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  rules: readonly FabEvaluatedRule[],
  atom: Extract<FabContinuousAtom, { kind: "ability" }>,
): void {
  applyAbility(entry, subject, atom.property, atom.operation, rules);
}

function applyAbility(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  property: Extract<FabContinuousAtom, { kind: "ability" }>["property"],
  operation: "grant" | "remove",
  rules: readonly FabEvaluatedRule[],
): void {
  if (property.kind === "keyword") {
    const name = property.keyword.name;
    if (
      operation === "grant" &&
      (isRestricted("gain-keyword", subject, rules, name) ||
        isRestricted("gain-abilities", subject, rules))
    ) {
      record(subject, entry, `keyword:${name}`, "prevented");
      return;
    }
    if (operation === "grant") {
      // Replace in place when the keyword already exists so dynamic values
      // (Spellvoid X continuous grants over a catalog `type: "x"` placeholder)
      // actually update the live amount instead of no-op'ing on name match.
      const existing = subject.properties.keywords.findIndex((keyword) => keyword.name === name);
      if (existing >= 0) {
        subject.properties.keywords[existing] = property.keyword;
      } else {
        subject.properties.keywords.push(property.keyword);
      }
      subject.added.keywords.set(name, entry.effectId);
    } else if (!subject.added.keywords.has(name)) {
      subject.properties.keywords = subject.properties.keywords.filter(
        (keyword) => keyword.name !== name,
      );
    }
    record(subject, entry, `keyword:${name}`, operation);
    return;
  }
  if (property.kind === "ability") {
    if (operation === "grant" && isRestricted("gain-abilities", subject, rules)) {
      record(subject, entry, `ability:${property.ability.id}`, "prevented");
      return;
    }
    if (operation === "grant") {
      // Multiple effects can grant text-identical triggered abilities to the
      // same object (three Lumina Ascensions each grant a separate hit
      // trigger). Preserve each occurrence with a stable runtime identity so
      // trigger collection does not collapse them by the printed ability id.
      const duplicate = subject.properties.abilities.some(
        (ability) => ability.id === property.ability.id,
      );
      const ability = duplicate
        ? { ...property.ability, id: `${property.ability.id}#granted:${entry.effectId}` }
        : property.ability;
      subject.properties.abilities.push(ability);
      subject.added.abilities.set(ability.id, entry.effectId);
      record(subject, entry, `ability:${ability.id}`, operation);
    } else if (!subject.added.abilities.has(property.ability.id)) {
      subject.properties.abilities = subject.properties.abilities.filter(
        (ability) => ability.id !== property.ability.id,
      );
      record(subject, entry, `ability:${property.ability.id}`, operation);
    }
    return;
  }
  if (operation === "remove") {
    subject.properties.abilities = subject.properties.abilities.filter((ability) =>
      subject.added.abilities.has(ability.id),
    );
    subject.properties.keywords = subject.properties.keywords.filter((keyword) =>
      subject.added.keywords.has(keyword.name),
    );
  }
  record(subject, entry, "abilities", operation);
}
