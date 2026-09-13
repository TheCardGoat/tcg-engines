/**
 * Continuous "damage can't be prevented" / `be-prevented` restrictions.
 *
 * Printed patterns (Vynnset, Malign, Rok, weapon grants, …) compile to
 * continuous rule-modification atoms with `mode: "restrict"` and
 * `action: "be-prevented"`. At a deal-damage event boundary, preventions
 * (ward, spellvoid, arcane-barrier, fixed prevent effects) must not apply
 * when an active restriction matches the damage source.
 *
 * Matching mirrors defend-restriction subjectFilter handling (Benji):
 * - latched subjects (explicit object grants)
 * - `parameters.subjectFilter` against the damage source (e.g. name: "Runechant")
 * - explicit game scope + no filter = blanket restriction for the effect duration
 */
import type { FabObjectSnapshot, ProposedEvent } from "./events.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import { matchesFabSnapshotFilter } from "./state-rules-view.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";

/** True when continuous effects forbid prevention of this deal-damage event. */
export function damageIsUnpreventable(state: FabRulesSnapshot, event: ProposedEvent): boolean {
  if (event.name !== "deal-damage" || event.data.amount <= 0) return false;
  const source = event.data.source;
  const view = buildFabRulesView(state);

  for (const rule of view.rules("be-prevented")) {
    if (rule.mode !== "restrict") continue;
    if (rule.parameters.kind !== "rule-modification") continue;

    // Explicitly latched source objects ("this can't be prevented").
    if (
      source &&
      rule.scope.kind === "objects" &&
      rule.scope.subjects.some((subject) => subject.instanceId === source.instanceId)
    ) {
      return true;
    }

    const subjectFilter = rule.parameters.subjectFilter;
    if (subjectFilter) {
      if (!source) continue;
      if (damageSourceMatchesFilter(state, source, subjectFilter, rule.controllerId, view)) {
        return true;
      }
      continue;
    }

    // No subject filter and no latched subjects: blanket unpreventable for the
    // continuous duration (e.g. "damage can't be prevented this combat chain").
    if (rule.scope.kind === "game") return true;
  }
  return false;
}

/**
 * Printed "effects can't increase [arcane] damage that [this card] would deal".
 * Active restrict/modify-damage rules suppress damage-amount-boost replacements.
 */
export function damageIncreaseIsRestricted(state: FabRulesSnapshot, event: ProposedEvent): boolean {
  if (event.name !== "deal-damage" || event.data.amount <= 0) return false;
  const source = event.source ?? ("source" in event.data ? event.data.source : null);
  const view = buildFabRulesView(state);
  const damageType = event.data.damageType;

  for (const rule of view.rules("modify-damage")) {
    if (rule.mode !== "restrict") continue;
    if (rule.parameters.kind !== "rule-modification") continue;
    if (rule.parameters.damageType && damageType !== rule.parameters.damageType) continue;

    if (
      source &&
      rule.scope.kind === "objects" &&
      rule.scope.subjects.some((subject) => subject.instanceId === source.instanceId)
    ) {
      return true;
    }

    const subjectFilter = rule.parameters.subjectFilter;
    if (subjectFilter) {
      if (!source) continue;
      if (damageSourceMatchesFilter(state, source, subjectFilter, rule.controllerId, view)) {
        return true;
      }
      continue;
    }

    if (rule.scope.kind === "game") return true;
  }
  return false;
}

function damageSourceMatchesFilter(
  state: FabRulesSnapshot,
  source: FabObjectSnapshot,
  filter: NonNullable<
    Extract<
      import("./continuous/ir.ts").FabRuleParameters,
      { kind: "rule-modification" }
    >["subjectFilter"]
  >,
  controllerId: string,
  view: ReturnType<typeof buildFabRulesView>,
): boolean {
  // Prefer LKI snapshot matching so destroy-then-damage sequences (Runechant)
  // still qualify after the source leaves the arena.
  if (matchesFabSnapshotFilter(state, source, filter)) return true;
  const live = view.object(source.ref);
  if (!live) return false;
  return view.matchesFilter(live, filter, {
    controllerId,
    source: source.ref,
    bindings: { objects: {}, numbers: {}, strings: {} },
  });
}
