import type { FabActivatedAbility } from "@tcg/flesh-and-blood-types";
import { catalogZoneToEngine } from "../../rules/zones.ts";
import { FAB_ZONE_KINDS, type FabMatchState, type FabZoneKind } from "../../state.ts";
import type { FabProcessId } from "../../rules/events.ts";
import type { FabActivateProcedure, FabRulesProcess } from "../../rules/process.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { buildFabRulesView } from "../../rules/state-rules-view.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabActivationProcedureResult } from "./types.ts";
import { reverseFabRulesAction, type FabRulesActionReversalReason } from "../reversal.ts";
import { fabActiveAttackIdentity } from "../../game/combat.ts";
import type { FabTargetRef } from "../../rules/targets.ts";

export function activationPaymentCandidates(
  state: FabRulesSnapshot,
  actorId: string,
  alreadyPitched: readonly string[],
  asset: "resources" | "chi",
): { instanceId: string; value: number }[] {
  const view = buildFabRulesView(state);
  return state.containers.zonesByPlayerId[actorId]!.hand.flatMap((instanceId) => {
    const object = state.objects[instanceId];
    const evaluated = object
      ? view.object({ instanceId: object.instanceId, incarnation: object.incarnation })
      : null;
    const value = evaluated?.current.numeric.pitch ?? 0;
    const isChi = evaluated?.current.typeBox.subtypes.includes("Chi") ?? false;
    return !alreadyPitched.includes(instanceId) && value > 0 && (asset === "chi" ? isChi : !isChi)
      ? [{ instanceId, value }]
      : [];
  });
}

export function snapshotKnownObject(state: FabMatchState, instanceId: string) {
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const zone of FAB_ZONE_KINDS) {
      if (state.containers.zonesByPlayerId[playerId]![zone].includes(instanceId)) {
        return snapshotObject(state, instanceId, playerId, zone);
      }
    }
  }
  // CR 3.0.14: hosted sub-cards seat in subcardsByHostId with no zone-list
  // membership — snapshot them through their synthesized under location.
  for (const subcards of Object.values(state.containers.subcardsByHostId)) {
    if (!subcards.some((id) => id === instanceId)) continue;
    const owner = state.objects[instanceId]?.ownerId;
    if (!owner) return null;
    return snapshotObject(state, instanceId, owner, "under");
  }
  return null;
}

export function snapshotDeclaredTargetObject(state: FabMatchState, target: FabTargetRef) {
  if (target.kind !== "object") return null;
  const live = state.objects[target.ref.instanceId];
  if (!live || live.incarnation !== target.ref.incarnation) return null;
  return snapshotKnownObject(state, target.ref.instanceId);
}

/** Activation-declared destination for CR 8.5.41 Equip / CR 8.3.30 Modular. */
export const FAB_EQUIP_DESTINATION_TARGET_KEY = "equip-destination";

export const FAB_EQUIPMENT_SEAT_NAMES = ["head", "chest", "arms", "legs"] as const;
export type FabEquipmentSeatName = (typeof FAB_EQUIPMENT_SEAT_NAMES)[number];

export function isEquipmentSeatName(
  value: string | null | undefined,
): value is FabEquipmentSeatName {
  return value === "head" || value === "chest" || value === "arms" || value === "legs";
}

/** Legal empty equipment seats for a modular (or unzoned) re-equip. */
export function legalEquipDestinationSeats(
  state: FabRulesSnapshot,
  actorId: string,
  sourceInstanceId: string,
): readonly FabEquipmentSeatName[] {
  const current = sourceZone(state, actorId, sourceInstanceId);
  return FAB_EQUIPMENT_SEAT_NAMES.filter((seat) => {
    if (seat === current) return false;
    const occupants = state.containers.zonesByPlayerId[actorId]?.[seat] ?? [];
    return occupants.length === 0;
  });
}

export function sourceZone(
  state: FabRulesSnapshot,
  actorId: string,
  instanceId: string,
): FabZoneKind | null {
  const player = state.players[actorId];
  if (!player) return null;
  if (player.heroCardId === instanceId) return "heroZone";
  const owned = FAB_ZONE_KINDS.find((zone) =>
    state.containers.zonesByPlayerId[actorId]![zone].includes(instanceId),
  );
  if (owned) return owned;
  // "Any hero may activate" looks up a source seated under another player.
  for (const playerId of state.playerIds) {
    if (playerId === actorId) continue;
    const other = state.players[playerId];
    if (other?.heroCardId === instanceId) return "heroZone";
    const zone = FAB_ZONE_KINDS.find((candidate) =>
      state.containers.zonesByPlayerId[playerId]![candidate].includes(instanceId),
    );
    if (zone) return zone;
  }
  return null;
}

const DEFAULT_SELF_MOVE_ZONES = [
  "arena",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
] as const satisfies readonly FabZoneKind[];

/** Zones from which destroy-self / banish-self activation costs may be paid. */
export function activationSelfMoveZones(ability: FabActivatedAbility): readonly FabZoneKind[] {
  if (!ability.functionalZones || ability.functionalZones.length === 0) {
    return DEFAULT_SELF_MOVE_ZONES;
  }
  const zones: FabZoneKind[] = [];
  for (const catalogZone of ability.functionalZones) {
    if (catalogZone === "weapon") {
      zones.push("weapon1", "weapon2");
      continue;
    }
    const engineZone = catalogZoneToEngine(catalogZone);
    if (engineZone) zones.push(engineZone);
  }
  return zones;
}

export function actorMayActivateAbility(
  ability: FabActivatedAbility,
  actorId: string,
  controllerId: string | null | undefined,
): boolean {
  if (ability.activatableBy === "any-hero") return true;
  if (!controllerId) return true;
  return controllerId === actorId;
}

export function activationLimitKey(
  state: FabRulesSnapshot,
  actorId: string,
  instanceId: string,
  abilityId: string,
  per: NonNullable<FabActivatedAbility["limit"]>["per"],
): string {
  const window =
    per === "turn"
      ? `turn-${state.turnNumber}`
      : per === "game"
        ? "game"
        : per === "attack"
          ? `attack-${fabActiveAttackIdentity(state.combat?.activeLink?.activeAttack) ?? "none"}`
          : `combat-${state.combat?.chainLinkNumber ?? 0}`;
  return `${actorId}:${instanceId}:${abilityId}:${per}:${window}`;
}

export function effectiveActivationLimit(input: {
  readonly state: FabRulesSnapshot;
  readonly actorId: string;
  readonly instanceId: string;
  readonly incarnation: number;
  readonly ability: FabActivatedAbility;
}): number | null {
  const printed = input.ability.limit;
  if (
    !printed &&
    input.ability.abilityType !== "attack" &&
    input.ability.effect.type !== "attack-with"
  )
    return null;
  const base = printed?.per === "turn" ? printed.count : printed ? null : Number.POSITIVE_INFINITY;
  if (base === null) return printed!.count;
  const modifiers = input.state.activationLimitModifiers.filter(
    (modifier) =>
      modifier.controllerId === input.actorId &&
      modifier.turnNumber === input.state.turnNumber &&
      modifier.attackSourceRef.instanceId === input.instanceId &&
      modifier.attackSourceRef.incarnation === input.incarnation &&
      modifier.attackAbilityIds.includes(input.ability.id),
  );
  if (modifiers.length === 0) return Number.isFinite(base) ? base : null;
  const latestSetTotal = modifiers
    .filter((modifier) => modifier.operation === "set-total")
    .reduce<(typeof modifiers)[number] | undefined>(
      (latest, modifier) =>
        !latest || modifier.generatedSequence > latest.generatedSequence ? modifier : latest,
      undefined,
    );
  const floor = latestSetTotal?.count ?? base;
  const additional = modifiers
    .filter((modifier) => modifier.operation === "additional")
    .reduce((total, modifier) => total + modifier.count, 0);
  return floor + additional;
}

export function activationLimitUsageKey(input: {
  readonly state: FabRulesSnapshot;
  readonly actorId: string;
  readonly instanceId: string;
  readonly incarnation: number;
  readonly ability: FabActivatedAbility;
}): string | null {
  const modified = input.state.activationLimitModifiers.some(
    (modifier) =>
      modifier.controllerId === input.actorId &&
      modifier.turnNumber === input.state.turnNumber &&
      modifier.attackSourceRef.instanceId === input.instanceId &&
      modifier.attackSourceRef.incarnation === input.incarnation &&
      modifier.attackAbilityIds.includes(input.ability.id),
  );
  if (modified)
    return turnActivationUsageKey(input.state, input.actorId, input.instanceId, input.ability.id);
  return input.ability.limit
    ? activationLimitKey(
        input.state,
        input.actorId,
        input.instanceId,
        input.ability.id,
        input.ability.limit.per,
      )
    : null;
}

export function turnActivationUsageKey(
  state: FabRulesSnapshot,
  actorId: string,
  instanceId: string,
  abilityId: string,
): string {
  return activationLimitKey(state, actorId, instanceId, abilityId, "turn");
}

/** CR 5.2.3d-e: source-level grants share their allowance across the exact
 * attack abilities captured by the modifier, including uses before the grant. */
export function activationLimitUsageCount(input: {
  readonly state: FabRulesSnapshot;
  readonly actorId: string;
  readonly instanceId: string;
  readonly incarnation: number;
  readonly ability: FabActivatedAbility;
}): number {
  const modifiers = input.state.activationLimitModifiers.filter(
    (modifier) =>
      modifier.controllerId === input.actorId &&
      modifier.turnNumber === input.state.turnNumber &&
      modifier.attackSourceRef.instanceId === input.instanceId &&
      modifier.attackSourceRef.incarnation === input.incarnation &&
      modifier.attackAbilityIds.includes(input.ability.id),
  );
  if (modifiers.length === 0) {
    const key = activationLimitUsageKey(input);
    return key === null ? 0 : (input.state.abilityLimitUsage[key] ?? 0);
  }
  const sharedAbilityIds = new Set(modifiers.flatMap((modifier) => modifier.attackAbilityIds));
  return [...sharedAbilityIds].reduce(
    (total, abilityId) =>
      total +
      (input.state.abilityLimitUsage[
        turnActivationUsageKey(input.state, input.actorId, input.instanceId, abilityId)
      ] ?? 0),
    0,
  );
}

export function process(processId: FabProcessId, procedure: FabActivateProcedure): FabRulesProcess {
  return {
    processId,
    stage: "procedure",
    pendingEvents: [],
    futureSubjectEvents: [],
    replacementCandidates: [],
    replacementChoiceResolved: false,
    replacementChoicePlayerIds: [],
    selectedOptionalReplacementIds: [],
    orderedReplacementIds: [],
    appliedReplacementIds: [],
    cancelledContinuousApplicationKeys: [],
    pendingTriggers: [],
    orderedTriggerIds: [],
    triggerPlayerOrder: [],
    orderedTriggerControllers: [],
    stateTriggersOnStack: [],
    resolvingLayerId: null,
    effectChoices: {},
    effectPartitions: {},
    effectOptions: {},
    effectTargets: {},
    iterationCount: 0,
    journalReplacementOrders: {},
    journalReplacementChoices: {},
    journalReplacementChoicePlayerIds: {},
    resolutionEventGroups: [],
    procedure,
  };
}

export function rejected(
  state: FabMatchState,
  error: string,
  errorCode: string,
): FabActivationProcedureResult {
  return { kind: "failed", state, error, errorCode };
}

export function advanced(state: FabMatchState): FabActivationProcedureResult {
  return { kind: "advanced", state };
}

export function reverseActivation(
  state: FabMatchState,
  processId: FabProcessId,
  actorId: string,
  reason: FabRulesActionReversalReason,
): FabActivationProcedureResult {
  return {
    kind: "reversed",
    state: reverseFabRulesAction(state, processId, actorId),
    reason,
  };
}

/** CR 8.1.1d as-though-instant (Snap Shot ELE041-043, fused): "you may
 * activate abilities of bows you control an additional time this turn and as
 * though they were an instant" — an allow/activate rule-modification whose
 * filter carries the `activate-additional-as-instant` marker waives the
 * action-ability timing gate (stack open / combat step / active player) for
 * matching objects while the rule is live (this turn). The marker is a grant
 * tag, not object state — it is stripped before matching, mirroring the
 * reconciler's activation-limit projection (CR 5.2.3/5.2.3a "an additional
 * time" — Snap Shot is the CR's own example). */
export function asInstantActivationWaiver(
  view: import("../../rules/rules-view.ts").FabRulesView,
  actorId: string,
  object: import("../../rules/rules-view.ts").FabEvaluatedObject | null,
): boolean {
  if (!object) return false;
  return view.rules("activate").some((rule) => {
    if (rule.mode !== "allow" || rule.controllerId !== actorId) return false;
    const filter = rule.filter;
    if (!filter || filter.hasStatus !== "activate-additional-as-instant") return false;
    const { hasStatus: _marker, ...rest } = filter;
    return view.matchesFilter(object, rest, {
      controllerId: rule.controllerId,
      source: null,
      subject: object.ref,
      bindings: { objects: {}, numbers: {}, strings: {} },
    });
  });
}
