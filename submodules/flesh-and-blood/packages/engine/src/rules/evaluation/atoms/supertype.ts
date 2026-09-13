import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom, FabRulesFacts } from "../../rules-view.ts";
import {
  FAB_CLASS_SUPERTYPES,
  FAB_TALENT_SUPERTYPES,
  assertVocabulary,
  record,
  refKey,
  removeValue,
  type MutableObject,
} from "../atom-support.ts";

export function applySupertypeAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  atom: Extract<FabContinuousAtom, { kind: "supertype" }>,
  objects?: ReadonlyMap<string, MutableObject>,
  facts?: FabRulesFacts,
): void {
  const value = atom.property.value;
  const operation = atom.operation;
  if (operation === "grant") {
    // Shiyana / similar: catalog placeholder "hero-class" means the class
    // supertypes of the ability controller's current hero (additive).
    if (value === "hero-class") {
      const classNames = controllerHeroClassSupertypes(entry, objects, facts);
      for (const className of classNames) {
        if (!subject.properties.supertypes.includes(className)) {
          subject.properties.supertypes.push(className);
        }
        subject.added.supertypes.set(className, entry.effectId);
        record(subject, entry, `supertype:${className}`, operation);
      }
      return;
    }
    const exact = assertVocabulary("supertype", value);
    if (!subject.properties.supertypes.includes(exact)) subject.properties.supertypes.push(exact);
    subject.added.supertypes.set(value, entry.effectId);
  } else if (value === "class-and-talent") {
    const removable = new Set<string>([...FAB_CLASS_SUPERTYPES, ...FAB_TALENT_SUPERTYPES]);
    subject.properties.supertypes = subject.properties.supertypes.filter(
      (supertype) => !removable.has(supertype) || subject.added.supertypes.has(supertype),
    );
  } else if (!subject.added.supertypes.has(value)) {
    removeValue(subject.properties.supertypes, value);
  }
  record(subject, entry, `supertype:${value}`, operation);
}

function controllerHeroClassSupertypes(
  entry: FabActiveContinuousAtom,
  objects: ReadonlyMap<string, MutableObject> | undefined,
  facts: FabRulesFacts | undefined,
): readonly (typeof FAB_CLASS_SUPERTYPES)[number][] {
  if (!objects || !facts) return [];
  const heroRef = facts.heroRefs?.[entry.controllerId];
  if (!heroRef) return [];
  const hero = objects.get(refKey(heroRef));
  if (!hero) return [];
  return FAB_CLASS_SUPERTYPES.filter((className) => hero.properties.supertypes.includes(className));
}
