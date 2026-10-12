import { isLegalNumber } from "./number-value";
import {
  EntityPartitionValue,
  inputAllowsOmission,
  isEntityAllocationComplete,
} from "@tcg/protocol";
import type {
  InteractionAction,
  InteractionInput,
  InteractionResolutionRequirement,
  InteractionText,
  InteractionSubmissionValue,
} from "@tcg/protocol";

export type InteractionTargetPresentation = "drawer" | "none" | "spatial";
export type InteractionCommitMode = "confirm" | "immediate";
/**
 * Surface-level commit policy. Optional single-card selections keep the
 * staged Confirm flow by default; a surface may opt them into one-click
 * immediate resolution.
 */
export interface InteractionCommitPolicy {
  readonly immediateOptionalSingletons?: boolean;
}
export interface OptionalTargetInteraction {
  readonly decision: Extract<InteractionInput, { kind: "boolean" }>;
  readonly target: Extract<InteractionInput, { kind: "entity-selection" | "entity-partition" }>;
}
export interface OptionalDecisionInteraction {
  readonly decision: Extract<InteractionInput, { kind: "boolean" }>;
  readonly dependent: Exclude<InteractionInput, { kind: "boolean" }>;
}

export function resolveInteractionText(text: InteractionText): string {
  const preferred = ["label", "prompt", "sourceName", "cardName", "name"] as const;
  for (const key of preferred) {
    const value = text.params?.[key];
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return humanizeInteractionKey(text.key);
}

function humanizeInteractionKey(key: string): string {
  // Only dotted identifiers are translation keys. Literal instructions can
  // contain several sentences; dropping their first clauses changes meaning.
  if (!/^[A-Za-z_][\w-]*(?:\.[A-Za-z_][\w-]*)+$/.test(key)) return key;
  const segment = key.split(".").filter(Boolean).at(-1) ?? key;
  const words = segment
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  if (words.length === 0) return "Continue";
  return `${words.slice(0, 1).toUpperCase()}${words.slice(1)}`;
}

export function interactionBoundsCopy(
  input: Pick<InteractionResolutionRequirement, "min" | "max" | "required">,
  noun = "target",
  options: { readonly includeStatus?: boolean } = {},
): string {
  const min = input.min;
  const max = input.max;
  const plural = max === 1 ? noun : `${noun}s`;
  const prefix = input.required ? "Required" : "Optional";

  const status = options.includeStatus === false ? "" : `${prefix} · `;

  if (min === undefined || max === undefined) return prefix;
  if (min === 0) return `${status}Choose up to ${max} ${plural}`;
  if (min === max) return `${status}Choose exactly ${min} ${plural}`;
  return `${status}Choose ${min}–${max} ${plural}`;
}

export function requirementFromInput(input: InteractionInput): InteractionResolutionRequirement {
  const required =
    input.required === true || ("min" in input && typeof input.min === "number" && input.min > 0);
  switch (input.kind) {
    case "entity-selection":
    case "option-selection":
    case "ordering":
      return {
        kind: input.kind,
        text: input.text,
        required,
        min: input.min,
        max: input.max,
      };
    case "entity-allocation":
      return {
        kind: input.kind,
        text: input.text,
        required,
        min: input.totalMin,
        max: input.totalMax,
      };
    case "entity-partition":
      return {
        kind: input.kind,
        text: input.text,
        required,
        min: input.candidates.length,
        max: input.candidates.length,
      };
    case "boolean":
    case "number":
      return {
        kind: input.kind,
        text: input.text,
        required,
      };
  }
}

export function interactionCommitMode(
  input: InteractionInput,
  policy?: InteractionCommitPolicy,
): InteractionCommitMode {
  if ("cardDestination" in input && input.cardDestination) return "confirm";
  if (input.confirmBeforeSubmit || input.kind !== "entity-selection" || input.ordered)
    return "confirm";
  if (input.min === 1 && input.max === 1) return "immediate";
  if (policy?.immediateOptionalSingletons === true && input.min === 0 && input.max === 1) {
    return "immediate";
  }
  return "confirm";
}

export function interactionTargetPresentation(
  input: InteractionInput | undefined,
  visibleEntityIds: ReadonlySet<string>,
): InteractionTargetPresentation {
  if (input?.kind === "option-selection") {
    const options = input.options.filter((option) => option.enabled !== false);
    return options.length > 0 &&
      options.every(
        (option) =>
          option.entity?.kind === "card" && visibleEntityIds.has(option.entity.instanceId),
      )
      ? "spatial"
      : "none";
  }
  if (
    input?.kind !== "entity-selection" &&
    input?.kind !== "ordering" &&
    input?.kind !== "entity-partition" &&
    input?.kind !== "entity-allocation"
  )
    return "none";
  const candidates = input.candidates.filter((candidate) => candidate.enabled !== false);
  if (candidates.length === 0) return "none";
  const hasUnambiguousPartitionRoutes =
    input.kind !== "entity-partition" ||
    candidates.every(
      (candidate) =>
        input.routes.filter(
          (route) =>
            route.candidateIds === undefined ||
            route.candidateIds.includes(candidate.entity.instanceId),
        ).length <= 1,
    );
  return hasUnambiguousPartitionRoutes &&
    candidates.every((candidate) => visibleEntityIds.has(candidate.entity.instanceId))
    ? "spatial"
    : "drawer";
}

export function actionableInputs(action: InteractionAction): InteractionInput[] {
  return action.inputs.filter((input) => !isImplicitSingletonInput(input));
}

export function activeActionableInputs(
  action: InteractionAction,
  values: Readonly<Record<string, InteractionSubmissionValue>>,
): InteractionInput[] {
  return actionableInputs(action).filter((input) => inputRequirementsMatch(input, values));
}

export function currentActionableInput(
  action: InteractionAction,
  values: Readonly<Record<string, InteractionSubmissionValue>>,
  confirmedInputIds: ReadonlySet<string> = new Set(),
): InteractionInput | undefined {
  const inputs = activeActionableInputs(action, values);
  for (const input of inputs) {
    const value = values[input.id];
    if (
      value === undefined &&
      confirmedInputIds.has(input.id) &&
      inputAllowsOmission(input, values)
    )
      continue;
    if (!interactionInputComplete(input, value)) return input;
    if (!interactionInputAdvancesImmediately(input) && !confirmedInputIds.has(input.id))
      return input;
  }
  return undefined;
}

export function interactionInputComplete(
  input: InteractionInput,
  value: InteractionSubmissionValue | undefined,
): boolean {
  if (value === undefined || value === null) return false;
  switch (input.kind) {
    case "entity-selection":
      return Array.isArray(value) && value.length >= input.min && value.length <= input.max;
    case "option-selection":
      if (input.presentation?.kind === "cost-slots") {
        const slots = input.presentation.slots;
        if (!Array.isArray(value) || value.length !== slots.length) return false;
        const entities = value.map(
          (id) => input.options.find((o) => o.id === id && o.enabled)?.entity?.instanceId,
        );
        return (
          entities.every(Boolean) &&
          new Set(entities).size === entities.length &&
          value.every((id, index) => slots[index]!.optionIds.includes(id))
        );
      }
      return Array.isArray(value) && value.length >= input.min && value.length <= input.max;
    case "ordering":
      return Array.isArray(value) && value.length >= input.min && value.length <= input.max;
    case "boolean":
      return typeof value === "boolean";
    case "number":
      return typeof value === "number" && isLegalNumber(value, input);
    case "entity-partition": {
      const parsed = EntityPartitionValue.safeParse(value);
      if (!parsed.success) return false;
      const partition = parsed.data;
      const enabled = new Set(
        input.candidates
          .filter((candidate) => candidate.enabled !== false)
          .map((candidate) => candidate.entity.instanceId),
      );
      const assigned = new Set<string>();
      if (Object.keys(partition).some((id) => !input.routes.some((route) => route.id === id)))
        return false;
      let extracted = 0;
      for (const route of input.routes) {
        const selection = partition[route.id] ?? [];
        if (selection.length < route.min || selection.length > route.max) return false;
        for (const id of selection) {
          if (
            !enabled.has(id) ||
            assigned.has(id) ||
            (route.candidateIds && !route.candidateIds.includes(id))
          )
            return false;
          assigned.add(id);
        }
        if (route.kind === "extract") extracted += selection.length;
      }
      if (
        input.routes.some(
          (route) =>
            route.minWhenRemainingAtLeast &&
            enabled.size - extracted >= route.minWhenRemainingAtLeast.count &&
            (partition[route.id]?.length ?? 0) < route.minWhenRemainingAtLeast.min,
        )
      )
        return false;
      return input.assignment !== "exhaustive" || assigned.size === enabled.size;
    }
    case "entity-allocation":
      return isEntityAllocationComplete(input, value);
  }
}

export function interactionInputAdvancesImmediately(input: InteractionInput): boolean {
  if ("cardDestination" in input && input.cardDestination) return false;
  if (input.confirmBeforeSubmit) return false;
  if (input.kind === "boolean") return true;
  if (input.kind === "option-selection")
    return input.presentation?.kind !== "cost-slots" && input.min === 1 && input.max === 1;
  return input.kind === "entity-selection" && input.min === 1 && input.max === 1 && !input.ordered;
}

function inputRequirementsMatch(
  input: InteractionInput,
  values: Readonly<Record<string, InteractionSubmissionValue>>,
): boolean {
  if (!input.requiredWhen) return true;
  return input.requiredWhen.some((requirement) =>
    requirement.all.every((condition) =>
      interactionValueMatches(values[condition.inputId], condition.value),
    ),
  );
}

function interactionValueMatches(
  actual: InteractionSubmissionValue | undefined,
  expected: string | number | boolean | string[],
): boolean {
  if (Array.isArray(expected)) {
    return (
      Array.isArray(actual) &&
      actual.length === expected.length &&
      actual.every((entry, index) => entry === expected[index])
    );
  }
  return Array.isArray(actual) ? actual.includes(String(expected)) : actual === expected;
}

export function optionalTargetInteraction(
  inputs: readonly InteractionInput[],
): OptionalTargetInteraction | undefined {
  const optional = optionalDecisionInteraction(inputs);
  if (
    optional?.dependent.kind !== "entity-selection" &&
    optional?.dependent.kind !== "entity-partition"
  ) {
    return undefined;
  }
  return { decision: optional.decision, target: optional.dependent };
}

/**
 * An optional effect whose acceptance immediately requires another answer is
 * one player-facing choice: answer the dependent input or skip the effect.
 */
export function optionalDecisionInteraction(
  inputs: readonly InteractionInput[],
): OptionalDecisionInteraction | undefined {
  for (const decision of inputs) {
    if (decision.kind !== "boolean") continue;
    const dependent = inputs.find(
      (input): input is Exclude<InteractionInput, { kind: "boolean" }> =>
        input.kind !== "boolean" &&
        input.requiredWhen?.some((requirement) =>
          requirement.all.some(
            (condition) => condition.inputId === decision.id && condition.value === true,
          ),
        ) === true,
    );
    if (dependent) return { decision, dependent };
  }
  return undefined;
}

export function implicitSubmissionValues(
  action: InteractionAction,
): Record<string, InteractionSubmissionValue> {
  const values: Record<string, InteractionSubmissionValue> = {};
  for (const input of action.inputs) {
    if (!isImplicitSingletonInput(input)) continue;
    if (input.kind === "option-selection") values[input.id] = [input.options[0]!.id];
  }
  return values;
}

function isImplicitSingletonInput(input: InteractionInput): boolean {
  if (input.required !== true) return false;
  if (input.kind === "option-selection") {
    return (
      input.implicit === true && input.min === 1 && input.max === 1 && input.options.length === 1
    );
  }
  return false;
}
