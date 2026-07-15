import { PROBE_REGISTRIES, PROBE_VERSION } from "./registries";
import type { ProbeCheck, ProbeInput, ProbeResult, ProbeStatus, ProbeSurface } from "./types";

/**
 * `probeSupport` walks a partial ability shape and reports, for every
 * variant reference it finds, whether the engine currently supports it.
 *
 * The probe is **purely structural**. It checks discriminator strings
 * against the registries that drive `evaluateCondition`,
 * `resolveActionEffect`, and the targeting dispatcher. It does not
 * execute the runtime, so it cannot tell you "this ability runs cleanly
 * end-to-end" — only "every variant referenced has a registered handler".
 *
 * Use the result before authoring or extending a card:
 * - `result.ok === true` → all referenced variants are registered. Author away.
 * - `result.missing` non-empty → at least one variant has no handler. Either
 *   choose a different shape or extend the engine (see engine AGENTS.md).
 * - `result.unknown` non-empty → the probe couldn't classify a value. Either
 *   the structure is malformed or the probe needs a new walker case.
 */
export function probeSupport(input: ProbeInput): ProbeResult {
  const checks: ProbeCheck[] = [];

  if (input.ability !== undefined) {
    walkAbility(input.ability, "ability", checks);
  }

  if (input.effect !== undefined) {
    const type = typeof input.effect === "string" ? input.effect : input.effect.type;
    if (type !== undefined) {
      checks.push(checkEffectType(type, "input.effect"));
    }
  }

  if (input.condition !== undefined) {
    const type = typeof input.condition === "string" ? input.condition : input.condition.type;
    if (type !== undefined) {
      checks.push(checkConditionType(type, "input.condition"));
    }
  }

  if (input.target !== undefined) {
    walkTarget(input.target, "input.target", checks);
  }

  if (input.trigger !== undefined) {
    if (input.trigger.event !== undefined) {
      checks.push(checkTriggerEvent(input.trigger.event, "input.trigger.event"));
    }
    if (input.trigger.on !== undefined) {
      walkTriggerSubject(input.trigger.on, "input.trigger.on", checks);
    }
  }

  const missing = checks.filter((c) => c.status === "missing");
  const unknown = checks.filter((c) => c.status === "unknown");

  return {
    ok: missing.length === 0 && unknown.length === 0,
    checks,
    missing,
    unknown,
    probeVersion: PROBE_VERSION,
  };
}

// ---------------------------------------------------------------------------
// Walkers
// ---------------------------------------------------------------------------

function walkAbility(ability: Record<string, unknown>, path: string, checks: ProbeCheck[]): void {
  const type = ability.type;
  if (typeof type === "string") {
    checks.push(check("ability-type", type, `${path}.type`, "ABILITY_TYPES", isAbilityType(type)));
  }

  if (ability.trigger && typeof ability.trigger === "object") {
    const trigger = ability.trigger as Record<string, unknown>;
    if (typeof trigger.event === "string") {
      checks.push(checkTriggerEvent(trigger.event, `${path}.trigger.event`));
    }
    if (trigger.on !== undefined) {
      walkTriggerSubject(trigger.on, `${path}.trigger.on`, checks);
    }
  }

  if (ability.condition !== undefined) {
    walkCondition(ability.condition, `${path}.condition`, checks);
  }

  if (ability.effect !== undefined) {
    walkEffect(ability.effect, `${path}.effect`, checks);
  }

  // Action cards use `effect`; replacement uses `replacement`.
  if (ability.replacement !== undefined) {
    walkEffect(ability.replacement, `${path}.replacement`, checks);
  }
  if (ability.replaces !== undefined) {
    // Replaces is itself an effect-shape (the event being replaced); walk it
    // so trigger/effect references inside still get checked.
    walkEffect(ability.replaces, `${path}.replaces`, checks);
  }
}

function walkEffect(value: unknown, path: string, checks: ProbeCheck[]): void {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkEffect(item, `${path}[${i}]`, checks));
    return;
  }
  const effect = value as Record<string, unknown>;
  const type = effect.type;
  if (typeof type === "string") {
    checks.push(checkEffectType(type, `${path}.type`));
  }

  // Targets attached to effects.
  if (effect.target !== undefined) {
    walkTarget(effect.target, `${path}.target`, checks);
  }

  // Composition recursion. The list mirrors the composed-effect-resolver
  // dispatch table in shape, not in detail — the probe doesn't need every
  // field, only the nested effect references.
  if (Array.isArray(effect.steps)) {
    effect.steps.forEach((step, i) => walkEffect(step, `${path}.steps[${i}]`, checks));
  }
  if (effect.effect !== undefined) {
    walkEffect(effect.effect, `${path}.effect`, checks);
  }
  if (Array.isArray(effect.choices)) {
    effect.choices.forEach((choice, i) => {
      if (choice && typeof choice === "object" && "effect" in choice) {
        walkEffect(
          (choice as Record<string, unknown>).effect,
          `${path}.choices[${i}].effect`,
          checks,
        );
      }
    });
  }
  if (Array.isArray(effect.alternatives)) {
    effect.alternatives.forEach((alt, i) => walkEffect(alt, `${path}.alternatives[${i}]`, checks));
  }
  if (effect.then !== undefined) {
    walkEffect(effect.then, `${path}.then`, checks);
  }
  if (effect.else !== undefined) {
    walkEffect(effect.else, `${path}.else`, checks);
  }
  if (effect.condition !== undefined) {
    walkCondition(effect.condition, `${path}.condition`, checks);
  }
}

function walkCondition(value: unknown, path: string, checks: ProbeCheck[]): void {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkCondition(item, `${path}[${i}]`, checks));
    return;
  }
  const cond = value as Record<string, unknown>;
  const type = cond.type;
  if (typeof type === "string") {
    checks.push(checkConditionType(type, `${path}.type`));
  }

  // Boolean composers.
  if (Array.isArray(cond.conditions)) {
    cond.conditions.forEach((c, i) => walkCondition(c, `${path}.conditions[${i}]`, checks));
  }
  if (cond.condition !== undefined) {
    walkCondition(cond.condition, `${path}.condition`, checks);
  }
  if (cond.left !== undefined) {
    walkCondition(cond.left, `${path}.left`, checks);
  }
  if (cond.right !== undefined) {
    walkCondition(cond.right, `${path}.right`, checks);
  }
}

function walkTarget(value: unknown, path: string, checks: ProbeCheck[]): void {
  if (typeof value === "string") {
    checks.push(checkTargetEnum(value, path));
    return;
  }
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkTarget(item, `${path}[${i}]`, checks));
    return;
  }
  const target = value as Record<string, unknown>;
  if (typeof target.selector === "string") {
    checks.push(checkTargetSelector(target.selector, `${path}.selector`));
  }
  if (typeof target.reference === "string") {
    checks.push(checkTargetSelector(target.reference, `${path}.reference`));
  }
  if (typeof target.ref === "string") {
    // `{ ref: "previous-target" }` — currently neither in selectors nor
    // references, so flag as a known target ref family the probe accepts.
    checks.push(checkTargetRef(target.ref, `${path}.ref`));
  }
}

function walkTriggerSubject(value: unknown, path: string, checks: ProbeCheck[]): void {
  if (typeof value === "string") {
    checks.push(checkTriggerSubject(value, path));
    return;
  }
  // Query-shape (TriggerSubjectQuery) — accept silently. The probe only
  // checks the discriminator-string surface; deep filter validation is
  // outside scope and would duplicate type-checking.
}

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

function checkEffectType(type: string, path: string): ProbeCheck {
  return check(
    "effect",
    type,
    path,
    "ACTION_EFFECT_RESOLVER_TYPES",
    PROBE_REGISTRIES.effectTypes.includes(type as never),
  );
}

function checkConditionType(type: string, path: string): ProbeCheck {
  return check(
    "condition",
    type,
    path,
    "CONDITION_VARIANT_TYPES",
    (PROBE_REGISTRIES.conditionTypes as readonly string[]).includes(type),
  );
}

function checkTargetSelector(selector: string, path: string): ProbeCheck {
  return check(
    "target",
    selector,
    path,
    "TARGET_VARIANT_TYPES",
    (PROBE_REGISTRIES.targetSelectors as readonly string[]).includes(selector),
  );
}

function checkTargetEnum(value: string, path: string): ProbeCheck {
  // A bare string target may be either an enum alias or a selector keyword
  // (e.g. "SELF"). Accept both.
  const isEnum = PROBE_REGISTRIES.targetEnumAliases.includes(value);
  const isSelector = (PROBE_REGISTRIES.targetSelectors as readonly string[]).includes(value);
  if (isEnum) return check("target-enum", value, path, "TARGET_ENUM_ALIASES", true);
  if (isSelector) return check("target", value, path, "TARGET_VARIANT_TYPES", true);
  return check("target-enum", value, path, "TARGET_ENUM_ALIASES", false);
}

function checkTargetRef(ref: string, path: string): ProbeCheck {
  // The `{ ref: ... }` form maps to LorcanaTargetReference values, which
  // are also represented in TARGET_VARIANT_TYPES (the references half).
  return check(
    "target",
    ref,
    path,
    "TARGET_VARIANT_TYPES (references)",
    (PROBE_REGISTRIES.targetSelectors as readonly string[]).includes(ref) ||
      ref === "previous-target",
    ref === "previous-target"
      ? "Probe accepts `previous-target` as a back-compat ref; not in TARGET_VARIANT_TYPES."
      : undefined,
  );
}

function checkTriggerEvent(event: string, path: string): ProbeCheck {
  return check(
    "trigger-event",
    event,
    path,
    "TriggerEvent",
    PROBE_REGISTRIES.triggerEvents.includes(event),
  );
}

function checkTriggerSubject(subject: string, path: string): ProbeCheck {
  return check(
    "trigger-subject",
    subject,
    path,
    "TriggerSubjectEnum",
    PROBE_REGISTRIES.triggerSubjects.includes(subject),
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function check(
  surface: ProbeSurface,
  value: string,
  path: string,
  registry: string,
  ok: boolean,
  reason?: string,
): ProbeCheck {
  const status: ProbeStatus = ok ? "ok" : "missing";
  return { surface, value, path, registry, status, reason };
}

function isAbilityType(type: string): boolean {
  return PROBE_REGISTRIES.abilityTypes.includes(type as never);
}
