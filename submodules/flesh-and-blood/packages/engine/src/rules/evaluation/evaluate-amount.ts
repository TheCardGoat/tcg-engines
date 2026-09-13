import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabObjectRef, FabResolvedBindings } from "../continuous/ir.ts";
import type { FabEvalContext } from "../rules-view.ts";
import { assertNever } from "./assert-never.ts";
import { evaluateBoundVariable } from "./amounts/bound-variable.ts";
import { evaluateConditional } from "./amounts/conditional.ts";
import { evaluateCount } from "./amounts/count.ts";
import { evaluateDifference } from "./amounts/difference.ts";
import { evaluateDouble } from "./amounts/double.ts";
import { evaluateEventAmount } from "./amounts/event-amount.ts";
import { evaluateTriggerEventDamage } from "./amounts/trigger-event-damage.ts";
import { evaluateHeroProperty } from "./amounts/hero-property.ts";
import { evaluateKeywordValue } from "./amounts/keyword-value.ts";
import { evaluateMax } from "./amounts/max.ts";
import { evaluateNegate } from "./amounts/negate.ts";
import { evaluateReference } from "./amounts/reference.ts";
import { evaluateRoll } from "./amounts/roll.ts";
import { evaluateRollResult } from "./amounts/roll-result.ts";
import { evaluateSubjectProperty } from "./amounts/subject-property.ts";
import { evaluateSum } from "./amounts/sum.ts";
import { evaluateUpTo } from "./amounts/up-to.ts";
import { countCandidates } from "./count-candidates.ts";
import {
  heroObjectsForAmountPlayer,
  refKey,
  subjectPropertyBindingKey,
  toCatalogZone,
  zoneObjectMatchesPlayer,
  type MutableObject,
} from "./helpers.ts";
import { matchesFilter } from "./matches-filter.ts";

export { countCandidates } from "./count-candidates.ts";

export function evaluateAmount(
  amount: FabAmount,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  if (typeof amount === "number") return amount;
  switch (amount.type) {
    case "reference":
      return evaluateReference(amount, context, objects);
    case "subject-property":
      return evaluateSubjectProperty(amount, context, objects);
    case "max":
      return evaluateMax(amount, context, objects);
    case "up-to":
      return evaluateUpTo(amount, context, objects);
    case "sum":
      return evaluateSum(amount, context, objects);
    case "difference":
      return evaluateDifference(amount, context, objects);
    case "negate":
      return evaluateNegate(amount, context, objects);
    case "double":
      return evaluateDouble(amount, context, objects);
    case "conditional":
      return evaluateConditional(amount, context, objects);
    case "x":
    case "y":
    case "z":
      return evaluateBoundVariable(amount, context, objects);
    case "count":
      return evaluateCount(amount, context, objects);
    case "hero-property":
      return evaluateHeroProperty(amount, context, objects);
    case "event-amount":
      return evaluateEventAmount(amount, context, objects);
    case "trigger-event-damage":
      return evaluateTriggerEventDamage(amount, context, objects);
    case "roll-result":
      return evaluateRollResult(amount, context, objects);
    case "keyword-value":
      return evaluateKeywordValue(amount, context, objects);
    case "roll":
      return evaluateRoll(amount, context, objects);
    default:
      return assertNever(amount, "FabAmount.type");
  }
}

export function amountDependencyRefs(
  amount: FabAmount,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly FabObjectRef[] {
  let refs: readonly FabObjectRef[];
  if (typeof amount === "number") refs = [];
  else
    switch (amount.type) {
      case "reference":
        refs = context.bindings.objects[amount.binding] ?? [];
        break;
      case "subject-property":
        refs = context.subject ? [context.subject] : [];
        break;
      case "max":
        refs = [...objects.values()]
          .filter(
            (object) =>
              (!amount.zones?.length ||
                amount.zones.includes(toCatalogZone(object.input.zone.zone))) &&
              zoneObjectMatchesPlayer(object, amount.player ?? "controller", context) &&
              (!amount.filter || matchesFilter(object, amount.filter, context, objects)),
          )
          .map((object) => object.input.ref);
        break;
      case "count": {
        const candidates = countCandidates(amount, context, objects).map(
          (object) => object.input.ref,
        );
        refs =
          amount.what === "cards-defending" ||
          amount.what === "defending-cards-controlled-by-opponent"
            ? (context.facts?.combat?.defending ?? [])
            : amount.what === "counters-on-source" || amount.what === "base-power-of-source"
              ? context.source
                ? [context.source]
                : []
              : candidates;
        break;
      }
      case "hero-property":
        refs = heroObjectsForAmountPlayer(amount.player, context, objects).map(
          (object) => object.input.ref,
        );
        break;
      case "up-to":
        refs = amountDependencyRefs(amount.amount, context, objects);
        break;
      case "sum":
      case "difference":
      case "negate":
      case "double":
        refs = amount.operands.flatMap((operand) =>
          amountDependencyRefs(operand, context, objects),
        );
        break;
      case "conditional":
        refs = [
          ...amountDependencyRefs(amount.then, context, objects),
          ...(amount.else ? amountDependencyRefs(amount.else, context, objects) : []),
        ];
        break;
      case "x":
      case "y":
      case "z":
      case "roll":
      case "event-amount":
      case "trigger-event-damage":
      case "roll-result":
      case "keyword-value":
        refs = [];
        break;
      default:
        return assertNever(amount, "FabAmount.type");
    }
  const unique = new Map(refs.map((ref) => [refKey(ref), ref]));
  return [...unique.values()];
}

export function lockSubjectPropertyAmounts(
  amount: FabAmount,
  context: FabEvalContext,
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  prior?: FabResolvedBindings,
): FabResolvedBindings {
  const numbers = { ...(prior ?? context.bindings).numbers };
  const visit = (candidate: FabAmount): void => {
    if (typeof candidate === "number") return;
    switch (candidate.type) {
      case "subject-property": {
        const key = subjectPropertyBindingKey(subject.input.ref, candidate);
        if (numbers[key] === undefined) numbers[key] = evaluateAmount(candidate, context, objects);
        return;
      }
      case "up-to":
        visit(candidate.amount);
        return;
      case "sum":
      case "difference":
      case "negate":
      case "double":
        candidate.operands.forEach(visit);
        return;
      case "conditional":
        visit(candidate.then);
        if (candidate.else !== undefined) visit(candidate.else);
        return;
      default:
        return;
    }
  };
  visit(amount);
  const base = prior ?? context.bindings;
  return { objects: base.objects, strings: base.strings, numbers };
}
