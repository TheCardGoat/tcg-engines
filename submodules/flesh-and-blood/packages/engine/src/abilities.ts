/** Strict read-only catalog ability inspection helpers. */

import type {
  FabAmount,
  FabCondition,
  FabEffect,
  FabModalAbility,
  FabResolutionAbility,
  FabSelectionCount,
  FabStaticAbility,
  FabTriggeredStaticAbility,
  FleshAndBloodAbility,
} from "@tcg/flesh-and-blood-types";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";
import { normalizeBaseObjectProperties, type FabRegisteredCardDefinition } from "./cards.ts";
import type { FabMatchState } from "./state.ts";
import { evaluateCanonicalCondition } from "./rules/condition-evaluator.ts";
import { createSyntheticFabObjectSnapshot, snapshotObject } from "./rules/snapshots.ts";
import { findObjectZone } from "./rules/state-rules-view.ts";
import { fabPlayerId } from "./game/identity.ts";

type TriggeredAbility = FabTriggeredStaticAbility;

function triggerObservesEvent(ability: TriggeredAbility, name: string): boolean {
  if (ability.trigger.kind === "state") return false;
  const expression = ability.trigger.event;
  return "patterns" in expression
    ? expression.patterns.some((pattern) => pattern.name === name)
    : expression.name === name;
}

export function abilitiesOf(
  definition: FabRegisteredCardDefinition | undefined,
): readonly FleshAndBloodAbility[] {
  return definition?.base.abilities ?? [];
}

export function hitTriggerAbilities(
  definition: FabRegisteredCardDefinition | undefined,
): TriggeredAbility[] {
  return abilitiesOf(definition).filter(
    (ability): ability is TriggeredAbility =>
      isTriggeredAbility(ability) && triggerObservesEvent(ability, "hit"),
  );
}

export function pitchTriggerAbilities(
  definition: FabRegisteredCardDefinition | undefined,
): TriggeredAbility[] {
  return abilitiesOf(definition).filter(
    (ability): ability is TriggeredAbility =>
      isTriggeredAbility(ability) && triggerObservesEvent(ability, "pitch"),
  );
}

export function fragmentTriggerAbilities(
  definition: FabRegisteredCardDefinition | undefined,
): TriggeredAbility[] {
  return abilitiesOf(definition).filter(
    (ability): ability is TriggeredAbility =>
      isTriggeredAbility(ability) && triggerObservesEvent(ability, "fragment"),
  );
}

export function isModalAbility(ability: FleshAndBloodAbility): ability is FabModalAbility {
  return ability.kind === "modal";
}

export function modalAbilities(
  definition: FabRegisteredCardDefinition | undefined,
): FabModalAbility[] {
  return abilitiesOf(definition).filter(isModalAbility);
}

export type FabModalChooseKind = "all" | "any-number" | "one-or-more" | "up-to" | "exact";

export function resolveModalChooseSelection(
  ability: FabModalAbility,
  evaluate: {
    readonly condition: (condition: FabCondition) => boolean;
    readonly amount: (amount: FabAmount) => number | null;
  },
): { count: number; kind: FabModalChooseKind } | null {
  const resolve = (raw: FabSelectionCount): { count: number; kind: FabModalChooseKind } | null => {
    if (typeof raw === "number") return { count: Math.max(0, Math.floor(raw)), kind: "exact" };
    if (raw.type === "all") return { count: ability.modes.length, kind: "all" };
    if (raw.type === "any-number") return { count: ability.modes.length, kind: "any-number" };
    if (raw.type === "one-or-more") return { count: ability.modes.length, kind: "one-or-more" };
    if (raw.type === "up-to") {
      const bound = typeof raw.amount === "number" ? raw.amount : evaluate.amount(raw.amount);
      if (bound === null) return null;
      return { count: Math.max(0, Math.floor(bound)), kind: "up-to" };
    }
    if (raw.type === "conditional") {
      const branch = evaluate.condition(raw.condition) ? raw.then : raw.else;
      if (branch === undefined) return { count: 0, kind: "exact" };
      return resolve(branch);
    }
    const amount = evaluate.amount(raw);
    if (amount === null) return null;
    return { count: Math.max(0, Math.floor(amount)), kind: "exact" };
  };
  return resolve(ability.modal.choose);
}

export function modalChooseBounds(ability: FabModalAbility): { min: number; max: number } {
  const choose = ability.modal.choose;
  if (typeof choose === "number") {
    const n = Math.max(0, Math.floor(choose));
    return { min: n, max: n };
  }
  if (choose.type === "up-to" && typeof choose.amount === "number") {
    const n = Math.max(0, Math.floor(choose.amount));
    return { min: 0, max: n };
  }
  if (choose.type === "all") {
    const n = ability.modes.length;
    return { min: n, max: n };
  }
  if (choose.type === "any-number") return { min: 0, max: ability.modes.length };
  if (choose.type === "one-or-more") return { min: 1, max: ability.modes.length };
  throw new Error(`unsupported dynamic modal choose amount ${choose.type}`);
}

export function modalChooseCount(ability: FabModalAbility): number {
  return modalChooseBounds(ability).max;
}

export function selectModalModes(
  ability: FabModalAbility,
  selection: {
    readonly modeIds?: readonly string[];
    readonly modeIndexes?: readonly number[];
    readonly randomPick?: (maxExclusive: number) => number;
  },
): readonly FabResolutionAbility[] {
  const modes = ability.modes;
  const choose = ability.modal.choose;
  if (typeof choose === "object" && choose.type === "all" && !ability.modal.random) {
    return modes;
  }
  const need = modalChooseCount(ability);
  const allowRepeat = ability.modal.allowRepeat === true;
  const byId = new Map(modes.map((mode) => [mode.id, mode] as const));
  const picked: FabResolutionAbility[] = [];
  const used = new Set<number>();

  const add = (mode: FabResolutionAbility): void => {
    const index = modes.indexOf(mode);
    if (!allowRepeat && used.has(index)) return;
    used.add(index);
    picked.push(mode);
  };

  if (selection.modeIds) {
    for (const id of selection.modeIds) {
      const mode = byId.get(id);
      if (mode) add(mode);
      if (picked.length >= need) break;
    }
  } else if (selection.modeIndexes) {
    for (const raw of selection.modeIndexes) {
      const mode = modes[Math.floor(raw)];
      if (mode) add(mode);
      if (picked.length >= need) break;
    }
  } else if (ability.modal.random && selection.randomPick) {
    const modalPickGuard = createFabLoopGuard({ label: "abilities: random modal pick" });
    while (picked.length < need && (allowRepeat || used.size < modes.length)) {
      modalPickGuard.tick();
      const mode = modes[selection.randomPick(modes.length)];
      if (!mode) throw new Error("modal random selection returned an out-of-range index");
      add(mode);
    }
  }
  return picked;
}

export function hitTriggerRequiresHero(ability: TriggeredAbility): boolean {
  if (ability.trigger.kind === "state") return false;
  const expression = ability.trigger.event;
  const patterns = "patterns" in expression ? expression.patterns : [expression];
  return patterns.some((pattern) => pattern.name === "hit" && pattern.target?.kind === "hero");
}

export function continuousAbilities(
  definition: FabRegisteredCardDefinition | undefined,
): FabStaticAbility[] {
  return abilitiesOf(definition).filter(
    (ability): ability is FabStaticAbility =>
      ability.kind === "static" &&
      (ability.staticKind === "continuous" ||
        ability.staticKind === "property" ||
        ability.staticKind === "while"),
  );
}

export function aimCounterCount(state: FabMatchState, instanceId: string): number {
  return (
    state.objects[instanceId]?.counters.find(
      (counter) => counter.kind === "named" && counter.name.toLowerCase() === "aim",
    )?.count ?? 0
  );
}

/** Fail-closed bridge retained while callers migrate directly onto FabRulesView. */
export function evaluateAbilityCondition(
  state: FabMatchState,
  controllerId: string,
  sourceInstanceId: string | undefined,
  condition: FabCondition | undefined,
): boolean {
  if (!condition) return true;
  const record = sourceInstanceId ? state.objects[sourceInstanceId] : undefined;
  const zone = sourceInstanceId ? findObjectZone(state, sourceInstanceId) : null;
  const source =
    record && zone
      ? snapshotObject(state, record.instanceId, controllerId, zone.zone)
      : createSyntheticFabObjectSnapshot({
          ref: { instanceId: `condition-source-${controllerId}`, incarnation: 0 },
          canonicalId: null,
          objectKind: "macro",
          baseSource: { kind: "registered" },
          ownerId: controllerId,
          controllerId,
          zone: "hero",
          zoneRef: { playerId: fabPlayerId(controllerId), zone: "heroZone" },
          base: normalizeBaseObjectProperties({
            canonicalId: `condition-source-${controllerId}`,
            types: ["Hero"],
            health: state.players[controllerId]?.life,
            intelligence: state.players[controllerId]?.intellect,
          }),
        });
  return evaluateCanonicalCondition(state, condition, { controllerId, source }, null);
}

export function matchLastAttackIdentity(
  last:
    | {
        readonly name?: string;
        readonly color?: string;
        readonly types?: readonly string[];
      }
    | null
    | undefined,
  condition: Pick<
    Extract<FabCondition, { type: "last-attack-this-combat-chain" }>,
    "names" | "nameIncludes" | "color" | "filter"
  >,
): boolean {
  if (!last?.name) return false;
  const normalize = (value: string) => value.toLowerCase();
  if (condition.names && !condition.names.some((name) => normalize(name) === normalize(last.name!)))
    return false;
  if (
    condition.nameIncludes &&
    !condition.nameIncludes.some((part) => normalize(last.name!).includes(normalize(part)))
  )
    return false;
  if (condition.color && normalize(condition.color) !== normalize(last.color ?? "")) return false;
  if (condition.filter) {
    const types = last.types ?? [];
    const box = condition.filter.typeBox;
    if (box?.types?.some((type) => !types.includes(type))) return false;
    if (box?.subtypes?.some((type) => !types.includes(type))) return false;
    if (box?.supertypes?.some((type) => !types.includes(type))) return false;
    if (box?.metatypes?.some((type) => !types.includes(type))) return false;
  }
  return true;
}

export function comboAbilities(
  definition: FabRegisteredCardDefinition | undefined,
): FleshAndBloodAbility[] {
  return abilitiesOf(definition).filter((ability) => ability.label?.name === "combo");
}

export function evaluateLifeComparison(
  state: FabMatchState,
  playerId: string,
  condition: Extract<FabCondition, { type: "life-comparison" }>,
): boolean {
  return evaluateAbilityCondition(state, playerId, undefined, condition);
}

function isTriggeredAbility(ability: FleshAndBloodAbility): ability is TriggeredAbility {
  return ability.kind === "static" && ability.staticKind === "triggered";
}

export type FabStrictEffect = FabEffect;
