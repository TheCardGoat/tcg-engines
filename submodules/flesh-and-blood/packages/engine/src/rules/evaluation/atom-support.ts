import {
  FAB_CLASS_SUPERTYPES,
  FAB_TALENT_SUPERTYPES,
  type FabBaseObjectProperties,
} from "@tcg/flesh-and-blood-types";
import type {
  FabContinuousAtom,
  FabContinuousApplication,
  FabEvaluatedContribution,
  FabObjectRef,
  FabResolvedBindings,
  FabRuleAction,
} from "../continuous/ir.ts";
import type {
  FabActiveContinuousAtom,
  FabEvalContext,
  FabEvaluatedRule,
  FabRulesFacts,
} from "../rules-view.ts";
import { FabRulesEvaluationError } from "./errors.ts";
import {
  assertVocabulary,
  cloneMutable,
  refKey,
  removeValue,
  type MutableObject,
  type MutableProperties,
} from "./helpers.ts";
import { evaluateAmount, lockSubjectPropertyAmounts } from "./evaluate-amount.ts";
import { requireSingleTarget, resolveTarget } from "./resolve-target.ts";

export {
  FAB_CLASS_SUPERTYPES,
  FAB_TALENT_SUPERTYPES,
  assertVocabulary,
  cloneMutable,
  evaluateAmount,
  lockSubjectPropertyAmounts,
  refKey,
  removeValue,
  requireSingleTarget,
  resolveTarget,
};
export type { MutableObject, MutableProperties };

export function contextFor(
  entry: FabActiveContinuousAtom,
  facts: FabRulesFacts,
  subject?: FabObjectRef,
): FabEvalContext {
  return {
    controllerId: entry.controllerId,
    source: entry.source,
    ...(subject ? { subject } : {}),
    bindings: entry.lockedBindings,
    facts,
  };
}

export function acceptedApplicationForSubject(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
): FabContinuousApplication | undefined {
  return entry.acceptedApplications.find(
    (application) =>
      application.subject.kind === "object" &&
      refKey(application.subject.ref) === refKey(subject.input.ref),
  );
}

export function contextWithApplicationBindings(
  entry: FabActiveContinuousAtom,
  facts: FabRulesFacts,
  subject: FabObjectRef,
  application?: FabContinuousApplication,
): FabEvalContext {
  const context = contextFor(entry, facts, subject);
  if (!application) return context;
  return {
    ...context,
    bindings: {
      objects: { ...application.lockedBindings.objects, ...entry.lockedBindings.objects },
      numbers: { ...application.lockedBindings.numbers, ...entry.lockedBindings.numbers },
      strings: { ...application.lockedBindings.strings, ...entry.lockedBindings.strings },
    },
  };
}

export function isRestricted(
  action: FabRuleAction,
  subject: MutableObject,
  rules: readonly FabEvaluatedRule[],
  keywordName?: string,
): boolean {
  return rules.some((rule) => {
    if (rule.action !== action || rule.mode !== "restrict") return false;
    if (
      rule.scope.kind === "objects" &&
      !rule.scope.subjects.some((ref) => refKey(ref) === refKey(subject.input.ref))
    ) {
      return false;
    }
    if (
      keywordName &&
      rule.parameters.kind === "rule-modification" &&
      rule.parameters.keyword &&
      rule.parameters.keyword !== keywordName
    ) {
      return false;
    }
    return true;
  });
}

export function resolvePlayer(
  player: Extract<FabContinuousAtom, { kind: "controller" }>["controller"],
  controllerId: string,
  objects: ReadonlyMap<string, MutableObject>,
): string {
  if (player === "self" || player === "controller") return controllerId;
  if (player === "opponent") {
    const other = [...new Set([...objects.values()].map((object) => object.input.ownerId))].find(
      (playerId) => playerId !== controllerId,
    );
    if (other) return other;
  }
  throw new FabRulesEvaluationError(
    `controller player ${typeof player === "string" ? player : "binding"}`,
  );
}

export function immutableProperties(properties: MutableProperties): FabBaseObjectProperties {
  const firstFaceId = properties.activeFaceIds[0];
  const firstTypeBox = properties.typeBoxes[0];
  if (!firstFaceId || !firstTypeBox) {
    throw new FabRulesEvaluationError("object properties must retain at least one active face");
  }
  return {
    names: [...properties.names],
    activeFaceIds: [firstFaceId, ...properties.activeFaceIds.slice(1)],
    color: properties.color,
    typeBoxes: [firstTypeBox, ...properties.typeBoxes.slice(1)],
    typeBox: {
      metatypes: [...properties.metatypes],
      supertypes: [...properties.supertypes],
      types: [...properties.types],
      subtypes: [...properties.subtypes],
    },
    traits: [...properties.traits],
    textBoxIds: [...properties.textBoxIds],
    numeric: { ...properties.numeric },
    keywords: [...properties.keywords],
    abilities: [...properties.abilities],
  };
}

export function contributionForAtom(
  atom: FabContinuousAtom,
  subject: MutableObject,
  operation: string,
): FabEvaluatedContribution {
  switch (atom.kind) {
    case "rule":
      throw new FabRulesEvaluationError("rule contribution at object stage");
    case "activation-cost":
      throw new FabRulesEvaluationError("activation-cost contribution at object stage");
    case "copy":
    case "copy-abilities":
    case "become":
      return { kind: "base-properties", value: immutableProperties(subject.properties) };
    case "controller":
      return { kind: "controller", controllerId: subject.controllerId };
    case "identity":
    case "type":
    case "supertype":
    case "ability":
      return {
        kind: "property",
        property: atom.property,
        operation: operation === "remove" ? "remove" : "grant",
      };
    case "base-numeric":
    case "numeric": {
      const value = subject.properties.numeric[atom.property];
      return {
        kind: "numeric",
        property: atom.property,
        operation: atom.operation,
        value: value ?? null,
        previousValue: null,
        delta: null,
        propertyPresent: value !== undefined,
      };
    }
    default: {
      const _exhaustive: never = atom;
      throw new FabRulesEvaluationError(`atom contribution ${JSON.stringify(_exhaustive)}`);
    }
  }
}

export function createApplication(
  entry: FabActiveContinuousAtom,
  subject: import("../continuous/ir.ts").FabRulesSubjectRef,
  contribution: FabEvaluatedContribution,
  fingerprint?: string,
  lockedBindings?: FabResolvedBindings,
): FabContinuousApplication {
  return {
    effectId: entry.effectId,
    atomId: entry.atom.atomId,
    subject,
    contribution,
    lockedBindings: lockedBindings ?? entry.lockedBindings,
    firstAppliedAt: entry.timestamp,
    lastChangedAt: entry.timestamp,
    fingerprint: fingerprint ?? JSON.stringify(contribution),
  };
}

export function record(
  subject: MutableObject,
  entry: FabActiveContinuousAtom,
  property: string,
  operation: string,
  contribution?: FabEvaluatedContribution,
  fingerprint?: string,
  lockedBindings?: FabResolvedBindings,
): void {
  subject.effectIds.add(entry.effectId);
  subject.provenance.push({
    property,
    operation,
    effectId: entry.effectId,
    atomId: entry.atom.atomId,
  });
  if (operation === "prevented") return;
  subject.applications.push(
    createApplication(
      entry,
      { kind: "object", ref: subject.input.ref },
      contribution ?? contributionForAtom(entry.atom, subject, operation),
      fingerprint,
      lockedBindings,
    ),
  );
}
