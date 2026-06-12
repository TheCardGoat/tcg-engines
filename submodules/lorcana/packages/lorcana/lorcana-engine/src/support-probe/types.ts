import type { ConditionVariantType } from "../rules/condition-evaluator";
import type { TargetVariantType } from "../targeting/variants";

export type ProbeAbilityType =
  | "keyword"
  | "triggered"
  | "activated"
  | "static"
  | "action"
  | "replacement";

export type ProbeSurface =
  | "ability-type"
  | "effect"
  | "condition"
  | "target"
  | "target-enum"
  | "trigger-event"
  | "trigger-subject";

export type ProbeStatus = "ok" | "missing" | "unknown";

export type ProbeCheck = {
  surface: ProbeSurface;
  value: string;
  status: ProbeStatus;
  registry?: string;
  path: string;
  reason?: string;
};

export type ProbeResult = {
  ok: boolean;
  /** All checks the probe attempted, in traversal order. */
  checks: ProbeCheck[];
  /** Subset of checks where status === "missing". */
  missing: ProbeCheck[];
  /** Subset of checks where status === "unknown" (probe could not classify). */
  unknown: ProbeCheck[];
  probeVersion: string;
};

export type ProbeInput = {
  /**
   * A partial ability shape — anything that could be authored into a card.
   * The probe walks the structure, collects every variant reference, and
   * checks each against the engine's registries.
   */
  ability?: Record<string, unknown>;
  /** Shorthand: probe a single effect by type. */
  effect?: { type?: string } | string;
  /** Shorthand: probe a single condition by type. */
  condition?: { type?: string } | string;
  /** Shorthand: probe a single target reference. */
  target?: unknown;
  /** Shorthand: probe trigger event/subject. */
  trigger?: { event?: string; on?: unknown };
};

export type ProbeRegistries = {
  abilityTypes: readonly ProbeAbilityType[];
  effectTypes: readonly string[];
  conditionTypes: readonly ConditionVariantType[];
  targetSelectors: readonly TargetVariantType[];
  targetEnumAliases: readonly string[];
  triggerEvents: readonly string[];
  triggerSubjects: readonly string[];
};
