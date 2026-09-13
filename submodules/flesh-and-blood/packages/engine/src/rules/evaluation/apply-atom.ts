import type { FabActiveContinuousAtom, FabEvaluatedRule, FabRulesFacts } from "../rules-view.ts";
import { assertNever } from "./assert-never.ts";
import type { MutableObject } from "./mutable.ts";
import { applyAbilityAtom } from "./atoms/ability.ts";
import { applyBaseNumericAtom } from "./atoms/base-numeric.ts";
import { applyBecomeAtom } from "./atoms/become.ts";
import { applyControllerAtom } from "./atoms/controller.ts";
import { applyCopyAtom } from "./atoms/copy.ts";
import { applyCopyAbilitiesAtom } from "./atoms/copy-abilities.ts";
import { applyIdentityAtom } from "./atoms/identity.ts";
import { applyNumericAtom } from "./atoms/numeric.ts";
import { applyRuleAtom } from "./atoms/rule.ts";
import {
  defenseGainIsRestricted,
  numericModificationIsRestricted,
  powerGainAmplification,
  powerGainIsRestricted,
} from "./power-gain-restrictions.ts";
import { applySupertypeAtom } from "./atoms/supertype.ts";
import { applyTypeAtom } from "./atoms/type.ts";

export function applyAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  rules: readonly FabEvaluatedRule[],
  facts: FabRulesFacts,
  applicationMode: "desired" | "accepted",
): void {
  const { atom } = entry;
  switch (atom.kind) {
    case "copy":
      applyCopyAtom(entry, subject, objects, facts, atom);
      return;
    case "become":
      applyBecomeAtom(entry, subject, objects, facts, atom);
      return;
    case "controller":
      applyControllerAtom(entry, subject, objects, atom);
      return;
    case "identity":
      applyIdentityAtom(entry, subject, rules, atom);
      return;
    case "type":
      applyTypeAtom(entry, subject, atom);
      return;
    case "supertype":
      applySupertypeAtom(entry, subject, atom, objects, facts);
      return;
    case "ability":
      applyAbilityAtom(entry, subject, rules, atom);
      return;
    case "copy-abilities":
      applyCopyAbilitiesAtom(entry, subject, objects, facts, atom);
      return;
    case "base-numeric":
      if (
        (atom.property === "power" || atom.property === "defense" || atom.property === "cost") &&
        numericModificationIsRestricted(rules, subject, objects, facts)
      ) {
        return;
      }
      applyBaseNumericAtom(entry, subject, objects, facts, atom);
      return;
    case "numeric":
      if (
        (atom.property === "power" || atom.property === "defense" || atom.property === "cost") &&
        numericModificationIsRestricted(rules, subject, objects, facts)
      ) {
        return;
      }
      if (
        atom.property === "power" &&
        atom.operation === "add" &&
        powerGainIsRestricted(rules, subject, entry.source, objects, facts)
      ) {
        return;
      }
      if (
        atom.property === "defense" &&
        atom.operation === "add" &&
        defenseGainIsRestricted(rules, subject, objects, facts)
      ) {
        return;
      }
      if (atom.property === "power" && atom.operation === "add") {
        const bonus = powerGainAmplification(rules, subject, objects, facts);
        if (bonus > 0) {
          applyNumericAtom(entry, subject, objects, facts, applicationMode, {
            ...atom,
            amount: typeof atom.amount === "number" ? atom.amount + bonus : atom.amount,
          });
          return;
        }
      }
      applyNumericAtom(entry, subject, objects, facts, applicationMode, atom);
      return;
    case "rule":
      applyRuleAtom(entry, subject, atom);
      return;
    case "activation-cost":
      // Quote-only atoms are excluded by rules-evaluator before object stages.
      return;
    default:
      assertNever(atom, "FabContinuousAtom.kind");
  }
}
