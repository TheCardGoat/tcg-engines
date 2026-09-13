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
  if (!key.includes(".")) return key;
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
): string {
  const min = input.min;
  const max = input.max;
  const plural = max === 1 ? noun : `${noun}s`;
  const prefix = input.required ? "Required" : "Optional";

  if (min === undefined || max === undefined) return prefix;
  if (min === 0) return `${prefix} · Choose up to ${max} ${plural}`;
  if (min === max) return `${prefix} · Choose exactly ${min} ${plural}`;
  return `${prefix} · Choose ${min}–${max} ${plural}`;
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
  if (input.kind !== "entity-selection" || input.ordered) return "confirm";
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
    case "option-selection":
    case "ordering":
      return Array.isArray(value) && value.length >= input.min && value.length <= input.max;
    case "boolean":
      return typeof value === "boolean";
    case "number":
      return typeof value === "number";
    case "entity-partition":
      if (typeof value !== "object" || Array.isArray(value)) return false;
      const partition = value as Record<string, unknown>;
      return input.routes.every((route) => {
        const selection = partition[route.id];
        return (
          Array.isArray(selection) && selection.length >= route.min && selection.length <= route.max
        );
      });
    case "entity-allocation": {
      if (typeof value !== "object" || Array.isArray(value)) return false;
      const allocation = value as Record<string, unknown>;
      const total = input.candidates.reduce((sum, candidate) => {
        const amount = allocation[candidate.entity.instanceId];
        return sum + (typeof amount === "number" ? amount : 0);
      }, 0);
      return total >= input.totalMin && total <= input.totalMax;
    }
  }
}

export function interactionInputAdvancesImmediately(input: InteractionInput): boolean {
  if (input.kind === "boolean") return true;
  if (input.kind === "option-selection") return input.min === 1 && input.max === 1;
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
