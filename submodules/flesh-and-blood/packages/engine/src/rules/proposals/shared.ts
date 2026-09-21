import {
  isFabAmount,
  isQuantifier,
  isUpToCount,
  type FabAmount,
  type FabCondition,
  type FabDuration,
  type FabEffect,
  type FabPlayer,
  type FabSelectionCount,
  type FabTarget,
  type FabZone,
} from "@tcg/flesh-and-blood-types";
import { FAB_ZONE_KINDS } from "../../state.ts";
import { nextRandom } from "../../random.ts";
import type {
  FabEventBindings,
  FabObjectSnapshot,
  FabProcessId,
  ProposedEvent,
} from "../events.ts";
import {
  activeFabCardResolutionStep,
  fabLayerTargets,
  type FabRulesStackLayer,
} from "../layers.ts";
import { snapshotObject, snapshotPlayerId } from "../snapshots.ts";
import {
  buildFabRulesViewWithLki,
  matchesFabSnapshotFilter,
  resolveFabEventBindings,
} from "../state-rules-view.ts";
import { fabBindingContinuationRef } from "../binding-reanchor.ts";
import { fabAllDefenders } from "../../game/combat.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabContinuousExpiry, FabObjectRef } from "../continuous/ir.ts";
import type { FabTargetMap } from "../targets.ts";
import {
  catalogZoneMatchesTargetZones,
  catalogZoneToEngine,
  expandCatalogZonesForScan,
  isOnCombatChain,
} from "../zones.ts";
import { libraryPlayerId } from "../shared-library.ts";
import { snapshotDeclaredAttackTarget } from "../combat-target.ts";
import {
  isEquipRestricted,
  pairsPartnerMissing,
  treats2hSwordAs1h,
} from "../equip-restrictions.ts";
import {
  resolveEquipSlot,
  weaponOccupantForDefinition,
  type FabWeaponOccupant,
} from "../weapons/weapon-area.ts";

export type FabEffectProposalResult =
  | {
      readonly supported: true;
      readonly events: readonly ProposedEvent[];
      readonly eventGroups?: readonly (readonly ProposedEvent[])[];
      /** Typed effect completion; payment is never inferred from event cardinality. */
      readonly outcome?: "committed" | "proposed" | "failed";
    }
  | { readonly supported: false; readonly reason: string };

export function unsupported(effect: FabEffect, reason: string): FabEffectProposalResult {
  return { supported: false, reason: `${effect.type}: ${reason}` };
}

/** Shared dispatch context passed to leaf-effect proposal modules. */
export interface ProposalContext {
  readonly state: FabRulesSnapshot;
  readonly layer: FabRulesStackLayer;
  readonly processId: FabProcessId;
  readonly effectChoices: Readonly<Record<string, boolean>>;
  readonly effectPartitions: Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>;
  readonly effectOptions: Readonly<Record<string, string>>;
  readonly effectTargets: FabTargetMap;
  readonly effectPaymentPitches: Readonly<Record<string, readonly FabObjectRef[]>>;
  readonly effectPath: readonly number[];
  readonly targetPath: string;
}

export function withObjectIncarnationOffset(
  state: FabRulesSnapshot,
  offset: number,
): FabRulesSnapshot {
  return offset === 0
    ? state
    : {
        ...state,
        counters: {
          ...state.counters,
          objectIncarnation: state.counters.objectIncarnation + offset,
        },
      };
}

export function proposedObjectResetCount(events: readonly ProposedEvent[]): number {
  return events.filter(
    (event) =>
      event.name === "create" ||
      ("destinationRef" in event.data && event.data.destinationRef !== null),
  ).length;
}

export function attackTargetController(target: import("../../state.ts").FabAttackTarget): string {
  return target.kind === "hero" ? target.playerId : target.controllerId;
}

export function effectsForLayer(layer: FabRulesStackLayer): readonly FabEffect[] {
  switch (layer.kind) {
    case "card":
      return activeFabCardResolutionStep(layer).effects;
    case "activated":
      return [layer.effect];
    case "triggered":
      if (layer.resolution.kind === "effect") return [layer.resolution.effect];
      {
        const modal = layer.resolution.ability;
        return [
          ...(modal.effect ? [modal.effect] : []),
          ...layer.modes.flatMap((modeId) => {
            const mode = modal.modes.find((candidate) => candidate.id === modeId);
            return mode ? [mode.effect] : [];
          }),
        ];
      }
  }
}

export function layerWithEventBindings(
  layer: FabRulesStackLayer,
  events: readonly ProposedEvent[],
): FabRulesStackLayer {
  const bindings = events.reduce(
    (merged, event) => {
      const { resultingEvent: _observationMarker, ...gameBindings } = event.bindings;
      const next = { ...merged, ...gameBindings };
      const priorGraveyard = bindingSnapshots(merged["put-into-graveyard-this-way"]);
      const eventGraveyard = bindingSnapshots(event.bindings["put-into-graveyard-this-way"]);
      if (eventGraveyard.length > 0) {
        const cohort = uniqueSnapshots([...priorGraveyard, ...eventGraveyard]);
        next["put-into-graveyard-this-way"] = cohort;
        next["put-into-graveyard-this-way-count"] = cohort.length;
      }
      const priorArena = bindingSnapshots(merged["put-into-arena-this-way"]);
      const eventArena = bindingSnapshots(event.bindings["put-into-arena-this-way"]);
      if (eventArena.length > 0) {
        const cohort = uniqueSnapshots([...priorArena, ...eventArena]);
        next["put-into-arena-this-way"] = cohort;
        next["put-into-arena-this-way-count"] = cohort.length;
      }
      const priorHand = bindingSnapshots(merged["put-into-hand-this-way"]);
      const eventHand = bindingSnapshots(event.bindings["put-into-hand-this-way"]);
      if (eventHand.length > 0) {
        const cohort = uniqueSnapshots([...priorHand, ...eventHand]);
        next["put-into-hand-this-way"] = cohort;
        next["put-into-hand-this-way-count"] = cohort.length;
      }
      const priorHeroes = bindingSnapshots(merged["heroes-dealt-damage-this-way"]);
      const eventHeroes = bindingSnapshots(event.bindings["heroes-dealt-damage-this-way"]);
      if (eventHeroes.length > 0) {
        const cohort = uniqueSnapshots([...priorHeroes, ...eventHeroes]);
        next["heroes-dealt-damage-this-way"] = cohort;
        next["heroes-dealt-damage-this-way-count"] = cohort.length;
      }
      const priorBanished = bindingSnapshots(merged["banished-this-way"]);
      const eventBanished = bindingSnapshots(event.bindings["banished-this-way"]);
      if (eventBanished.length > 0) {
        const cohort = uniqueSnapshots([...priorBanished, ...eventBanished]);
        next["banished-this-way"] = cohort;
        next["banished-this-way-count"] = cohort.length;
      }
      return next;
    },
    { ...layer.bindings },
  );
  switch (layer.kind) {
    case "card":
      return { ...layer, bindings };
    case "activated":
      return { ...layer, bindings };
    case "triggered":
      return { ...layer, bindings };
  }
}

function bindingSnapshots(value: FabEventBindings[string]): readonly FabObjectSnapshot[] {
  if (Array.isArray(value)) return value;
  return value && typeof value === "object" && "instanceId" in value ? [value] : [];
}

function uniqueSnapshots(values: readonly FabObjectSnapshot[]): readonly FabObjectSnapshot[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = `${value.ref.instanceId}:${value.ref.incarnation}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function baseEvent(layer: FabRulesStackLayer, processId: FabProcessId) {
  return {
    processId,
    actorId: layer.controllerId,
    cause: {
      kind: "layer" as const,
      layerId: layer.layerId,
      source: layer.source,
      controllerId: layer.controllerId,
    },
    controllerId: layer.controllerId,
    source: layer.source,
    bindings: layer.bindings,
  };
}

export function heroTargets(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  target: FabTarget,
  targetPath: string,
  effectTargets: FabTargetMap = {},
  effectPath: readonly number[] = [],
): readonly string[] | null {
  const controllerId = layer.controllerId;
  switch (target.selector) {
    case "controller":
      return [controllerId];
    case "opponent":
      // 1v1 product: the sole opposing seat (never a multi-opponent set).
      return state.playerIds.filter((playerId) => playerId !== controllerId);
    case "hero":
      return playersForFabPlayer(state, controllerId, target.who, layer.bindings);
    case "each-hero": {
      // CR 1.10.2b turn order: printed "starting with the hero to your left"
      // iterates from the seat after the controller, then around the table
      // (1v1 product: [opponent, controller] for a seat list of
      // [controller, opponent]).
      const controllerIndex = state.playerIds.findIndex((playerId) => playerId === controllerId);
      if (controllerIndex < 0) return state.playerIds;
      return [
        ...state.playerIds.slice(controllerIndex + 1),
        ...state.playerIds.slice(0, controllerIndex + 1),
      ];
    }
    case "each-other-hero":
      // 1v1 product: cardinality is always 1 (the sole opponent).
      return state.playerIds.filter((playerId) => playerId !== controllerId);
    case "highest-life-hero":
      return strictLifeExtrema(state, "highest");
    case "lowest-life-hero":
      return strictLifeExtrema(state, "lowest");
    case "iteration-subject": {
      const subject = layer.bindings["iteration-subject"];
      return typeof subject === "string" && state.playerIds.some((playerId) => playerId === subject)
        ? [subject]
        : [];
    }
    case "attacking-hero":
      return optionalId(
        state.combat?.activeLink?.attackingPlayerId ?? state.lastClosedCombat?.attackingPlayerId,
      );
    case "defending-hero":
    case "attack-target":
      return optionalId(
        state.combat?.activeLink?.defendingPlayerId ?? state.lastClosedCombat?.defendingPlayerId,
      );
    case "any-hero": {
      const fromLayer = fabLayerTargets(layer)[`${targetPath}:target`] ?? [];
      const fromResolution =
        effectPath.length > 0 ? (effectTargets[effectPath.join(".")] ?? []) : [];
      const selected = (fromLayer.length > 0 ? fromLayer : fromResolution).flatMap((entry) =>
        entry.kind === "player" ? [entry.playerId] : [],
      );
      return selected.length === 1 && state.playerIds.some((playerId) => playerId === selected[0]!)
        ? selected
        : null;
    }
    case "winner":
    case "self":
    case "this-attack":
    case "attack-from-source":
    case "host":
    case "sub-cards":
    case "binding":
    case "object":
      return null;
  }
}

/**
 * CR "more/less {h} than all other heroes": unique strict max/min only.
 * Ties (including multi-way) yield an empty set so effects no-op.
 */
export function strictLifeExtrema(
  state: FabRulesSnapshot,
  rank: "highest" | "lowest",
): readonly string[] {
  const entries = state.playerIds
    .map((playerId) => {
      const life = state.players[playerId]?.life;
      return life === undefined ? null : { playerId, life };
    })
    .filter((entry) => entry !== null);
  if (entries.length === 0) return [];
  const extreme =
    rank === "highest"
      ? Math.max(...entries.map((entry) => entry.life))
      : Math.min(...entries.map((entry) => entry.life));
  const winners = entries.filter((entry) => entry.life === extreme).map((entry) => entry.playerId);
  return winners.length === 1 ? winners : [];
}

export function playersForFabPlayer(
  state: FabRulesSnapshot,
  controllerId: string,
  player: FabPlayer,
  /** Layer bindings — required for `iteration-subject` and `{ binding }`. */
  bindings: Readonly<Record<string, unknown>> = {},
): readonly string[] | null {
  if (typeof player === "object") {
    const bound = bindings[player.binding];
    return typeof bound === "string" && state.playerIds.some((playerId) => playerId === bound)
      ? [bound]
      : null;
  }
  switch (player) {
    case "controller":
    case "self":
      return [controllerId];
    case "opponent":
    case "another-hero":
    case "each-other-hero":
      return state.playerIds.filter((id) => id !== controllerId);
    case "any":
    case "each":
      return state.playerIds;
    case "highest-life-hero":
      return strictLifeExtrema(state, "highest");
    case "lowest-life-hero":
      return strictLifeExtrema(state, "lowest");
    case "iteration-subject": {
      const subject = bindings["iteration-subject"];
      return typeof subject === "string" && state.playerIds.some((playerId) => playerId === subject)
        ? [subject]
        : [];
    }
    case "turn-player":
      return optionalId(state.activePlayerId);
    case "attacking-hero":
      return optionalId(
        state.combat?.activeLink?.attackingPlayerId ?? state.lastClosedCombat?.attackingPlayerId,
      );
    case "defending-hero":
    case "attack-target":
      return optionalId(
        state.combat?.activeLink?.defendingPlayerId ?? state.lastClosedCombat?.defendingPlayerId,
      );
    case "winner": {
      // Clash/wager prize controller — set as string binding by proposeClash /
      // proposeWager when a winner is determined.
      const winner = bindings["winner"];
      return typeof winner === "string" && state.playerIds.some((playerId) => playerId === winner)
        ? [winner]
        : null;
    }
    case "loser": {
      const loser = bindings["loser"];
      return typeof loser === "string" && state.playerIds.some((playerId) => playerId === loser)
        ? [loser]
        : null;
    }
    case "target-controller": {
      // Target-relative amounts are evaluated after the consuming effect has
      // materialized one target.  The effect proposal supplies its controller
      // as a typed layer binding; never guess an opponent in multiplayer.
      const explicit = bindings["target-controller"];
      if (
        typeof explicit === "string" &&
        state.playerIds.some((playerId) => playerId === explicit)
      ) {
        return [explicit];
      }
      const bound = bindings["it"];
      const fromObject =
        bound && typeof bound === "object" && "controllerId" in bound
          ? (bound as { controllerId?: string | null }).controllerId
          : null;
      if (
        typeof fromObject === "string" &&
        state.playerIds.some((playerId) => playerId === fromObject)
      ) {
        return [fromObject];
      }
      // 1v1 product scope: "the controller of the target [hero]" with no
      // materialized binding resolves to the sole opposing seat (cold-snap
      // freeze family). Fail closed only in a hypothetical multiplayer seat
      // count, which this engine does not support.
      const opponents = state.playerIds.filter((playerId) => playerId !== controllerId);
      if (opponents.length === 1) return opponents;
      return null;
    }
  }
}

/**
 * CR 8.5.51a: a retrieve "may" is only offered when a legal pay exists. True
 * when an optional-wrapped retrieve has no target that can be legally paid
 * for and equipped — suppresses the may both at decision-finding and at
 * proposal time.
 */
export function retrieveOptionalIsUnavailable(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  effect: FabEffect,
): boolean {
  if (effect.type !== "retrieve") return false;
  const target = effect.target;
  if (!target || target.selector !== "object" || target.declared !== "at-resolution") return false;
  const pool = scanAtResolutionObjectPool(state, layer, target);
  if (pool === null) return false;

  const player = state.players[layer.controllerId];
  if (!player || !retrieveCostIsPayable(state, layer, effect.cost)) return true;

  return !pool.some((object) => {
    if (isEquipRestricted(state, layer.controllerId, object)) return false;
    if (pairsPartnerMissing(state, layer.controllerId, object)) return false;
    const destination = equipmentDestination(object) ?? effect.zone;
    if (!destination) return false;
    return destination === "weapon"
      ? nextFreeWeaponSlot(state, layer.controllerId, object) !== null
      : !nonWeaponEquipmentSeatOccupied(state, layer.controllerId, destination);
  });
}

function retrieveCostIsPayable(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  cost: Extract<FabEffect, { type: "retrieve" }>["cost"],
): boolean {
  if (cost.class !== "asset") return true;
  const player = state.players[layer.controllerId];
  if (!player) return false;
  const amount = resolveLayerAmount(state, layer, cost.amount);
  if (amount === null) return false;
  switch (cost.type) {
    case "resources":
      return player.resourcePoints + player.chiPoints >= amount;
    case "chi":
      return player.chiPoints >= amount;
    case "life":
      return player.life > amount;
    case "action-points":
      return player.actionPoints >= 1;
    case "power":
      return true;
  }
}

/**
 * CR 8.5.51a principle: a player cannot choose an action whose payment is
 * impossible. Returns the ORIGINAL indexes of choice options whose
 * at-resolution action remains available, so published option ids stay stable
 * against the catalog-encoded option list.
 */
export function availableChoiceOptionIndexes(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  effect: FabEffect & { type: "choice" },
): readonly number[] {
  const indexes: number[] = [];
  effect.options.forEach((option, index) => {
    if ("target" in option) {
      const target = option.target;
      if (
        target &&
        typeof target === "object" &&
        !("binding" in target) &&
        target.selector === "object" &&
        target.declared === "at-resolution"
      ) {
        const pool = scanAtResolutionObjectPool(
          state,
          layer,
          target as Parameters<typeof scanAtResolutionObjectPool>[2],
        );
        if (pool !== null && pool.length === 0) return;
      }
    }
    indexes.push(index);
  });
  return indexes;
}

/**
 * Scan at-resolution object candidates (including positioned top/bottom pools).
 * Returns the full legal pool before chooser selection is applied — used by
 * layer-resolution to decide whether a multi-seat positioned target needs a
 * chooser ("top card of target hero's deck").
 */
export function scanAtResolutionObjectPool(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  target: Extract<FabTarget, { selector: "object" }>,
): readonly FabObjectSnapshot[] | null {
  const relationCandidates = targetRelationCandidateIds(state, layer, target);
  const isQuantifierCount = isQuantifierCountValue(target.count);
  const isUpToCount = isUpToCountValue(target.count);
  if (typeof target.count !== "number" && !isQuantifierCount && !isUpToCount) return null;
  const defaultPlayer =
    typeof layer.bindings["iteration-subject"] === "string" ? "iteration-subject" : "controller";
  const relatedPlayerIds = playersForFabPlayer(
    state,
    layer.controllerId,
    target.player ?? defaultPlayer,
    layer.bindings,
  );
  if (!relatedPlayerIds) return null;
  const relatedPlayerIdSet = new Set(relatedPlayerIds);
  const playerIds = target.playerRelation === "owner" ? state.playerIds : relatedPlayerIds;
  const objects: FabObjectSnapshot[] = [];
  for (const playerId of playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    const playerObjects: FabObjectSnapshot[] = [];
    for (const zone of expandCatalogZonesForScan(target.zones)) {
      const engineZones =
        zone === "weapon"
          ? (["weapon1", "weapon2"] as const)
          : (() => {
              const single = canonicalEngineZone(zone);
              return single ? ([single] as const) : null;
            })();
      if (!engineZones) return null;
      for (const engineZone of engineZones) {
        if (engineZone === "under") {
          if (target.playerRelation === "owner" && playerId !== playerIds[0]) continue;
          const hosted = state.containers.subcardsByHostId[layer.source.instanceId] ?? [];
          for (const instanceId of hosted) {
            const object = snapshotObject(state, instanceId, playerId, "under");
            if (target.playerRelation === "owner" && !relatedPlayerIdSet.has(object.ownerId)) {
              continue;
            }
            if (relationCandidates && !relationCandidates.has(object.instanceId)) continue;
            playerObjects.push(object);
          }
          continue;
        }
        const zoneOwnerId = libraryPlayerId(state, playerId, engineZone);
        const zoneOwner = state.players[zoneOwnerId];
        if (!zoneOwner) continue;
        let instanceIds = [...state.containers.zonesByPlayerId[zoneOwnerId]![engineZone]];
        if (
          engineZone === "combatChain" &&
          instanceIds.length === 0 &&
          state.lastClosedCombat &&
          fabAllDefenders(state.lastClosedCombat).length > 0
        ) {
          for (const defenderId of fabAllDefenders(state.lastClosedCombat)) {
            const found = findObject(state, defenderId);
            if (!found) continue;
            if (
              target.filter &&
              !matchesFabSnapshotFilter(
                state,
                found,
                target.filter,
                layer.bindings,
                layer.controllerId,
                layer.source.ref,
              )
            )
              continue;
            playerObjects.push(found);
          }
          continue;
        }
        if (target.position === "top") instanceIds = instanceIds.slice().reverse();
        if (target.position === "bottom") instanceIds = instanceIds.slice();
        for (const instanceId of instanceIds) {
          const object = snapshotObject(state, instanceId, zoneOwnerId, engineZone);
          if (target.playerRelation === "owner" && !relatedPlayerIdSet.has(object.ownerId))
            continue;
          if (relationCandidates && !relationCandidates.has(object.instanceId)) continue;
          if (
            target.filter &&
            !matchesFabSnapshotFilter(
              state,
              object,
              target.filter,
              layer.bindings,
              layer.controllerId,
              layer.source.ref,
            )
          )
            continue;
          playerObjects.push(object);
        }
      }
    }
    // CR 7.2.2b: weapon/ally attack-sources stay seated or sit on the chain.
    // "Weapons/daggers you control" still includes the open-chain source.
    if (
      target.zones.includes("weapon") ||
      target.zones.includes("permanent") ||
      target.zones.includes("combat-chain")
    ) {
      const seen = new Set(playerObjects.map((object) => object.instanceId));
      const includeFromChain = (instanceId: string): void => {
        if (seen.has(instanceId)) return;
        const object = findObject(state, instanceId);
        if (!object) return;
        if (target.playerRelation === "owner") {
          if (!relatedPlayerIdSet.has(object.ownerId)) return;
        } else if (snapshotPlayerId(object) !== playerId) return;
        if (relationCandidates && !relationCandidates.has(object.instanceId)) return;
        if (
          target.filter &&
          !matchesFabSnapshotFilter(
            state,
            object,
            target.filter,
            layer.bindings,
            layer.controllerId,
            layer.source.ref,
          )
        )
          return;
        seen.add(instanceId);
        playerObjects.push(object);
      };
      for (const instanceId of state.containers.zonesByPlayerId[playerId]?.combatChain ?? []) {
        includeFromChain(instanceId);
      }
      const attackId = state.combat?.activeLink?.activeAttack.sourceObjectId;
      if (attackId) includeFromChain(attackId);
    }
    if (target.position) {
      // Per seat: top/bottom N. Multi-seat pools may exceed `count`.
      const sliceCount =
        typeof target.count === "number"
          ? target.count
          : isUpToCount && typeof target.count === "object" && "amount" in target.count
            ? typeof target.count.amount === "number"
              ? target.count.amount
              : playerObjects.length
            : playerObjects.length;
      objects.push(...(isQuantifierCount ? playerObjects : playerObjects.slice(0, sliceCount)));
    } else {
      objects.push(...playerObjects);
    }
  }
  return objects;
}

export function objectTargets(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  target: FabTarget,
  targetPath: string,
  effectTargets: FabTargetMap,
  effectPath: readonly number[],
  random = false,
  declaredKey = "target",
): readonly FabObjectSnapshot[] | null {
  // Randomness is a selection policy, never a type-box predicate.
  if (target.selector === "object") {
    random = random || Boolean(target.random);
  }
  if (target.selector === "self") {
    // Triggered effects can resolve after their source has moved (for example,
    // an equipment returns from the combat chain before its chain-close
    // trigger moves it to soul). Keep LKI only when the object no longer
    // exists; otherwise target its current zone like a bound object does.
    return [findObject(state, layer.source.instanceId) ?? layer.source];
  }
  if (target.selector === "this-attack") {
    const activeAttackId = state.combat?.activeLink?.activeAttack.sourceObjectId;
    if (!activeAttackId) return null;
    const activeAttack = findObject(state, activeAttackId);
    if (!activeAttack) return null;
    return target.filter &&
      !matchesFabSnapshotFilter(
        state,
        activeAttack,
        target.filter,
        layer.bindings,
        layer.controllerId,
        layer.source.ref,
      )
      ? []
      : [activeAttack];
  }
  if (target.selector === "binding") {
    const binding = layer.bindings[target.binding];
    let resolved: FabObjectSnapshot[] = [];
    if (isExactAttackBinding(binding)) {
      const active = state.combat?.activeLink?.activeAttack;
      const exact = binding.attack;
      const isCurrent =
        active?.kind === exact.attack.kind &&
        active.sourceObjectId === exact.instanceId &&
        (active.kind !== "proxy" ||
          (exact.attack.kind === "proxy" && active.proxyId === exact.attack.proxyId));
      if (!isCurrent) return null;
      const current = findObject(state, binding.object.instanceId);
      resolved = [current?.ref.incarnation === exact.incarnation ? current : binding.object];
    } else if (Array.isArray(binding)) {
      // Multi-card choose binds an array ("them"); single-card binds one snapshot.
      resolved = binding.flatMap((entry) => {
        if (!isObjectSnapshot(entry)) return [];
        const continuationRef = fabBindingContinuationRef(entry);
        const current = findObject(state, entry.instanceId);
        return [current?.ref.incarnation === continuationRef.incarnation ? current : entry];
      });
    } else if (!isObjectSnapshot(binding)) {
      // Missing `it` after a determined empty choose-card (no item/landmark)
      // is a no-op steal, not an unresolved target.
      return [];
    } else {
      // Event bindings retain immutable LKI, while an effect that moves the
      // bound object acts on its current zone if that object still exists.
      const continuationRef = fabBindingContinuationRef(binding);
      const current = findObject(state, binding.instanceId);
      resolved = [current?.ref.incarnation === continuationRef.incarnation ? current : binding];
    }
    if (target.exclude) {
      const excluded = layer.bindings[target.exclude];
      const excludedIds = new Set(
        (Array.isArray(excluded) ? excluded : excluded ? [excluded] : []).flatMap((entry) =>
          isObjectSnapshot(entry) ? [entry.instanceId] : [],
        ),
      );
      resolved = resolved.filter((object) => !excludedIds.has(object.instanceId));
    }
    if (target.filter) {
      resolved = resolved.filter((object) =>
        matchesFabSnapshotFilter(
          state,
          object,
          target.filter!,
          layer.bindings,
          layer.controllerId,
          layer.source.ref,
        ),
      );
    }
    return resolved;
  }
  if (target.selector === "object" && target.declared === "on-stack") {
    const targets = fabLayerTargets(layer)[`${targetPath}:${declaredKey}`] ?? [];
    return targets.flatMap((declaredTarget) => {
      if (declaredTarget.kind !== "object") return [];
      const object = findObject(state, declaredTarget.ref.instanceId);
      if (!object) return [];
      const selectedActiveAttack =
        target.zones.includes("combat-chain") &&
        isOnCombatChain(state, declaredTarget.ref.instanceId);
      // Cost payment can reconcile a seated weapon after it was selected.
      // The target is still this chain link's attack proxy while it remains
      // active; the continuous subject below locks to that proxy identity.
      if (object.ref.incarnation !== declaredTarget.ref.incarnation && !selectedActiveAttack)
        return [];
      // Weapon attacks retain their physical weapon-zone identity while the
      // combat chain references the attacking object. A target declared on
      // the combat chain therefore needs the combat role, not only the
      // object's physical zone, for zone filtering.
      const objectZone =
        target.zones.includes("combat-chain") &&
        isOnCombatChain(state, declaredTarget.ref.instanceId)
          ? "combat-chain"
          : eventZoneForSnapshot(object.zone);
      // permanent matches arena + equipment + weapon seats (CR arena permanents).
      // CR 7.2.2b: a weapon attack-source stays seated, but some snapshots still
      // report combat-chain. "Target dagger/weapon" must keep matching.
      const zoneMatches =
        objectZone !== null && catalogZoneMatchesTargetZones(objectZone, target.zones);
      const seatedWeaponMatches =
        object.current.typeBox.types.includes("Weapon") &&
        isOnCombatChain(state, object.instanceId) &&
        (target.zones.includes("weapon") || target.zones.includes("permanent"));
      if (!zoneMatches && !seatedWeaponMatches) return [];
      if (
        target.filter &&
        !matchesFabSnapshotFilter(
          state,
          object,
          target.filter,
          layer.bindings,
          layer.controllerId,
          layer.source.ref,
        )
      )
        return [];
      const relationCandidates = targetRelationCandidateIds(state, layer, target);
      if (relationCandidates && !relationCandidates.has(object.instanceId)) return [];
      return [object];
    });
  }
  if (target.selector === "object" && target.declared === "at-resolution") {
    // `all` is the auto-selected legal set. `any-number` is a 0..N player
    // choice over that same pool (Hope Merchant's Hood). Conditional counts
    // ("reveal 3, if it's their turn instead all") unwrap first so `all` /
    // exact-N / up-to keep the same 1.8.6c path.
    const countValue =
      target.count === undefined ? undefined : unwrapSelectionCount(state, layer, target.count);
    const resolvedCountTarget =
      countValue === undefined ? target : { ...target, count: countValue };
    const isAll = isAllCountValue(countValue);
    const isAnyNumber = isAnyNumberCountValue(countValue);
    const count =
      typeof countValue === "number"
        ? countValue
        : isAll || isAnyNumber || countValue === undefined
          ? null
          : resolveLayerAmount(state, layer, countValue);
    if (count === null && !isAll && !isAnyNumber) return null;
    // At-resolution choices need the same evaluated typed amount both when
    // publishing the decision and when turning its selected ids into objects.
    // Keeping this in the shared target resolver covers every effect leaf,
    // rather than hard-coding one card's damage-dealt count in a handler.
    const declaredPlayerEntries = target.playerTargetBinding
      ? Object.entries(fabLayerTargets(layer)).filter(([key]) =>
          key.endsWith(`:player@${target.playerTargetBinding}`),
        )
      : [];
    if (declaredPlayerEntries.length > 1) return null;
    const declaredPlayerTargets = target.playerTargetBinding
      ? (declaredPlayerEntries[0]?.[1] ?? [])
      : target.playerTarget
        ? (fabLayerTargets(layer)[`${targetPath}:player`] ?? [])
        : null;
    const declaredPlayerIds =
      declaredPlayerTargets?.flatMap((entry) =>
        entry.kind === "player" ? [entry.playerId] : [],
      ) ?? null;
    if (
      declaredPlayerIds &&
      (declaredPlayerIds.length !== 1 ||
        !state.playerIds.some((playerId) => playerId === declaredPlayerIds[0]!))
    )
      return null;
    const resolvedTarget = count === null ? resolvedCountTarget : { ...resolvedCountTarget, count };
    const targetLayer = declaredPlayerIds
      ? {
          ...layer,
          bindings: { ...layer.bindings, "declared-zone-player": declaredPlayerIds[0]! },
        }
      : layer;
    const targetForScan = declaredPlayerIds
      ? { ...resolvedTarget, player: { binding: "declared-zone-player" } as const }
      : resolvedTarget;
    const objects = scanAtResolutionObjectPool(state, targetLayer, targetForScan);
    if (!objects) return null;
    if (target.position) {
      // Positioned at-resolution targets used to auto-return every seat's top N,
      // which made "look at the top card of target hero's deck" (player:any,
      // count:1) silently look at *both* tops with no chooser. Correct behavior:
      // - all → every positioned match
      // - any-number → chooser over the positioned pool (0..N)
      // - explicit effectTargets selection → those cards (chooser answered)
      // - pool size ≤ count → auto (own deck top, top 3 of one seat, …)
      // - pool size > count without selection → null (layer-resolution opens chooser)
      if (isAll) return objects;
      if (isAnyNumber) {
        const selectedAny = effectTargets[effectPath.join(".")];
        if (!selectedAny) return objects.length === 0 ? objects : null;
        const selectedObjects = selectedAny.flatMap((entry) => {
          if (entry.kind !== "object") return [];
          const object = objects.find(
            (candidate) =>
              candidate.instanceId === entry.ref.instanceId &&
              candidate.ref.incarnation === entry.ref.incarnation,
          );
          return object ? [object] : [];
        });
        return selectedObjects.length === selectedAny.length ? selectedObjects : null;
      }
      if (count === null) return null;
      // “Each hero's top card” is one deterministic positioned object per
      // seat, not a single shared choice across the combined pool. It must
      // resolve all seats without inventing a target decision.
      if (target.player === "each") return objects;
      const selected = effectTargets[effectPath.join(".")];
      if (selected) {
        const selectedObjects = selected.flatMap((entry) => {
          if (entry.kind !== "object") return [];
          const object = objects.find(
            (candidate) =>
              candidate.instanceId === entry.ref.instanceId &&
              candidate.ref.incarnation === entry.ref.incarnation,
          );
          return object ? [object] : [];
        });
        if (
          selectedObjects.length === selected.length &&
          (target.upTo || isUpToCountValue(target.count)
            ? selectedObjects.length <= count
            : selectedObjects.length === Math.min(count, objects.length))
        ) {
          return selectedObjects;
        }
        return null;
      }
      if (objects.length <= count) return objects;
      return null;
    }
    if (target.random || random) {
      if (objects.length === 0) return [];
      if (isAll) return objects;
      if (isAnyNumber) return null;
      const pool = [...objects];
      const chosen: FabObjectSnapshot[] = [];
      let rngState = state.rngState;
      const pickCount = Math.min(count!, pool.length);
      for (let index = 0; index < pickCount; index += 1) {
        const roll = nextRandom(rngState);
        rngState = roll.state;
        chosen.push(...pool.splice(Math.floor(roll.value * pool.length), 1));
      }
      return chosen;
    }
    const selected = effectTargets[effectPath.join(".")];
    if (isAll) {
      // `all` means every currently legal target at the moment this leaf
      // proposes. Do not lock to an earlier process.effectTargets auto-scan —
      // a prior sequence step (look→banish, create→tutor) may have filled the
      // set after a pre-resolution pick captured empty (Nuu: free-play
      // blue from opposing banished after optional banish of the looked card).
      return objects;
    }
    if (isAnyNumber) {
      if (!selected) return objects.length === 0 ? [] : null;
      if (selected.length > objects.length) return null;
      const chosenAny = selected.flatMap((entry) => {
        if (entry.kind !== "object") return [];
        const object = objects.find(
          (candidate) =>
            candidate.instanceId === entry.ref.instanceId &&
            candidate.ref.incarnation === entry.ref.incarnation,
        );
        return object ? [object] : [];
      });
      return chosenAny.length === selected.length ? chosenAny : null;
    }
    // An empty legal set is a no-op, not an unresolved parameter.
    if (objects.length === 0) return [];
    // Explicit empty persist (exact N with pool < N) is a no-op, not unresolved.
    if (selected && selected.length === 0) return [];
    // CR 1.8.6c: exact N with pool.length <= N is determined (all legal
    // objects). "up to" still needs a player choice because 0 is legal.
    if (
      !selected &&
      typeof count === "number" &&
      !target.upTo &&
      !isUpToCountValue(target.count) &&
      objects.length <= count
    ) {
      return objects;
    }
    if (
      !selected ||
      selected.length > count! ||
      (!(target.upTo || isUpToCountValue(target.count)) &&
        selected.length !== Math.min(count!, objects.length))
    ) {
      return null;
    }
    const selectedObjects = selected.flatMap((entry) => {
      if (entry.kind !== "object") return [];
      const object = objects.find(
        (candidate) =>
          candidate.instanceId === entry.ref.instanceId &&
          candidate.ref.incarnation === entry.ref.incarnation,
      );
      return object ? [object] : [];
    });
    return selectedObjects.length === selected.length ? selectedObjects : null;
  }
  return null;
}

/** Resolve structural target relations through the canonical staged rules
 * view, then intersect proposal-time scans with those exact live identities. */
function targetRelationCandidateIds(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  target: Extract<FabTarget, { selector: "object" }>,
): ReadonlySet<string> | null {
  if (!target.relation) return null;
  const bindingLki = Object.values(layer.bindings).flatMap((value) =>
    isObjectSnapshot(value) ? [value] : Array.isArray(value) ? value.filter(isObjectSnapshot) : [],
  );
  return new Set(
    buildFabRulesViewWithLki(state, [layer.source, ...bindingLki])
      .targetCandidates(target, {
        controllerId: layer.controllerId,
        source: layer.source.ref,
        bindings: resolvedLayerBindings(layer),
      })
      .map((candidate) => candidate.ref.instanceId),
  );
}

export function discardTargets(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  target: FabTarget,
  targetPath: string,
  effectTargets: FabTargetMap,
  effectPath: readonly number[],
  random: boolean,
): readonly FabObjectSnapshot[] | null {
  const direct = objectTargets(state, layer, target, targetPath, effectTargets, effectPath, random);
  if (direct) return direct;
  const playerIds = heroTargets(state, layer, target, targetPath, effectTargets, effectPath);
  if (!playerIds || playerIds.length !== 1) return null;
  const playerId = playerIds[0]!;
  const hand = state.containers.zonesByPlayerId[playerId]?.hand ?? [];
  if (hand.length === 0) return [];
  if (hand.length !== 1) return null;
  return [snapshotObject(state, hand[0]!, playerId, "hand")];
}

export function damageTargets(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  target: FabTarget,
  targetPath: string,
  effectTargets: FabTargetMap,
  effectPath: readonly number[],
): readonly (FabObjectSnapshot | { readonly kind: "hero"; readonly playerId: string })[] | null {
  if (target.selector === "attack-target") {
    const attackTarget = snapshotDeclaredAttackTarget(
      state,
      state.combat?.activeLink?.attackTargetRef,
    );
    if (attackTarget) return [attackTarget];
    const playerIds = heroTargets(state, layer, target, targetPath, effectTargets, effectPath);
    if (playerIds && playerIds.length > 0) {
      return playerIds.map((playerId) => ({ kind: "hero" as const, playerId }));
    }
    // Instant / off-chain "that hero" after banishing their cards (Invert Existence).
    const bound = layer.bindings["banished-this-way"] ?? layer.bindings.it;
    const snapshots = (Array.isArray(bound) ? bound : bound ? [bound] : []).filter(
      isObjectSnapshot,
    );
    const owners = [
      ...new Set(snapshots.map((object) => snapshotPlayerId(object)).filter(Boolean)),
    ];
    if (owners.length === 1) return [{ kind: "hero" as const, playerId: owners[0]! }];
    return null;
  }
  const playerIds = heroTargets(state, layer, target, targetPath, effectTargets, effectPath);
  if (playerIds) return playerIds.map((playerId) => ({ kind: "hero" as const, playerId }));
  const objects = objectTargets(state, layer, target, targetPath, effectTargets, effectPath);
  if (!objects) return null;
  return objects.map((object) =>
    object.zone === "hero" ? { kind: "hero" as const, playerId: snapshotPlayerId(object) } : object,
  );
}

export function continuousFutureApplicability(effect: FabEffect):
  | {
      readonly filter: NonNullable<FabEffect["appliesTo"]>["next"];
      readonly events:
        | readonly import("@tcg/flesh-and-blood-types").FabFutureApplicabilityEvent[]
        | null;
      readonly observesOpponent: boolean;
      readonly count: number;
      readonly ordinal: number;
      readonly resets: "turn" | null;
      readonly sourceInstanceIds: readonly string[] | null;
    }
  | null
  | undefined {
  // Scramble Pulse family: "Equipment have -1{d} while defending this combat
  // chain" is authored as an at-resolution scan, which is empty in Layer.
  // Treat it as a this-chain defend latch (W3-EG3 window model).
  if (!effect.appliesTo) {
    if (
      effect.type === "modify-numeric" &&
      effect.duration === "this-combat-chain" &&
      "target" in effect &&
      typeof effect.target === "object" &&
      effect.target !== null &&
      "selector" in effect.target &&
      effect.target.selector === "object" &&
      effect.target.declared !== "on-stack" &&
      effect.target.filter?.defending === true
    ) {
      return {
        filter: effect.target.filter,
        events: ["defend"],
        observesOpponent: true,
        count: Number.POSITIVE_INFINITY,
        ordinal: 1,
        resets: null,
        sourceInstanceIds: null,
      };
    }
    return null;
  }
  const attacksOf = effect.appliesTo.attacksOf;
  const rawCount = effect.appliesTo.count ?? (attacksOf ? { type: "all" as const } : 1);
  const count =
    typeof rawCount === "number"
      ? rawCount
      : rawCount.type === "all" || rawCount.type === "any-number"
        ? Infinity
        : NaN;
  const ordinal = effect.appliesTo.ordinal ?? 1;
  const resets = effect.appliesTo.perTurn ? ("turn" as const) : null;
  const declaredEvents = effect.appliesTo.events
    ? [...new Set(effect.appliesTo.events)].sort()
    : null;
  // The effect discriminant owns the event family. An activation-cost
  // applicator cannot be consumed by announcing a card play merely because
  // its author omitted an optional appliesTo.events refinement.
  if (
    effect.type === "modify-activation-cost" &&
    declaredEvents?.some((event) => event !== "activate")
  )
    return undefined;
  // Omitted events are the effect family's default, not "any event".
  // Next-attack / next-card applicators observe announce + attack (CR 1.4.3e).
  // Activate is not an attack: consuming it latches the equipped weapon source
  // and leaks onto later proxies of the same instance.
  const defending =
    typeof effect.appliesTo.next === "object" &&
    effect.appliesTo.next !== null &&
    "defending" in effect.appliesTo.next &&
    effect.appliesTo.next.defending === true;
  const events =
    effect.type === "modify-activation-cost"
      ? (["activate"] as const)
      : (declaredEvents ??
        (defending
          ? (["defend"] as const)
          : attacksOf
            ? (["attack"] as const)
            : (["play", "attack"] as const)));
  if (count !== Infinity && (!Number.isInteger(count) || count < 1)) return undefined;
  if (!Number.isInteger(ordinal) || ordinal < 1) return undefined;
  if (events?.length === 0) return undefined;
  const target = "target" in effect ? effect.target : null;
  const targetSelector =
    typeof target === "object" && target !== null && "selector" in target ? target.selector : null;
  // Crush / Pulverize catalog often dummies `this-attack` for "their first
  // action/attack during their next turn". That is the damaged hero's next
  // object, not the source controller's (Sloggism / Emerging Power use
  // `this-turn` for "your next").
  const duration = "duration" in effect ? effect.duration : undefined;
  const nextTurnTheirObject =
    Boolean(effect.appliesTo?.next) &&
    (duration === "until-end-of-next-turn" || duration === "until-end-of-their-next-turn") &&
    targetSelector === "this-attack";
  const observesOpponent =
    nextTurnTheirObject ||
    (typeof target === "object" &&
      target !== null &&
      (("player" in target && target.player === "opponent") ||
        targetSelector === "opponent" ||
        targetSelector === "attack-target" ||
        targetSelector === "defending-hero"));
  return {
    filter: effect.appliesTo.next,
    events,
    observesOpponent,
    count,
    ordinal,
    resets,
    sourceInstanceIds: null,
  };
}

export function continuousDurationSupported(duration: string | undefined): duration is FabDuration {
  switch (duration) {
    case "this-turn":
    case "until-end-of-next-turn":
    case "until-end-of-own-next-turn":
    case "until-end-of-their-next-turn":
    case "until-start-of-own-next-turn":
    case "this-chain-link":
    case "this-combat-chain":
    case "while-in-arena":
    case "permanent":
    case "during-their-next-action-phase":
    case "during-own-next-action-phase":
    case "during-own-next-end-phase":
    case "during-their-next-end-phase":
    // CR 8.5.54 / SEA "until the end of this action phase": steal and similar
    // control changes compile to a current-turn action-phase window.
    case "until-end-of-action-phase":
      return true;
    default:
      return false;
  }
}

export function resolveContinuousExpiry(
  state: FabRulesSnapshot,
  source: FabObjectSnapshot,
  duration: FabDuration,
  options: { readonly ownAnchorPlayerId?: string | null } = {},
): FabContinuousExpiry | null {
  switch (duration) {
    case "this-turn":
      return { kind: "turn", turnNumber: state.turnNumber };
    case "until-end-of-next-turn":
      return { kind: "turn", turnNumber: state.turnNumber + 1 };
    case "until-start-of-own-next-turn": {
      return {
        kind: "player-turn-start",
        playerId: source.controllerId ?? source.ownerId,
        afterTurnNumber: state.turnNumber,
      };
    }
    // CR 6.2.2a: "until the end of [your/their] next turn" is anchored to a
    // specific seat's next turn and fixed at generation. When generated during
    // the anchor player's own turn, that next turn is two turns away (the
    // opponent takes the immediately following one) — the global
    // until-end-of-next-turn compilation would expire a full turn early.
    // "Own" anchors to the for-each iteration subject when one is bound
    // (DTD230: "each hero … during their next turn"), else the source
    // controller.
    case "until-end-of-own-next-turn":
    case "until-end-of-their-next-turn": {
      const fallbackControllerId = source.controllerId ?? source.ownerId;
      const controllerId =
        duration === "until-end-of-own-next-turn" && typeof options.ownAnchorPlayerId === "string"
          ? options.ownAnchorPlayerId
          : fallbackControllerId;
      const anchorId =
        duration === "until-end-of-own-next-turn"
          ? controllerId
          : (state.playerIds.find((playerId) => playerId !== fallbackControllerId) ??
            fallbackControllerId);
      return {
        kind: "player-turn-end",
        playerId: anchorId,
        turnNumber: state.activePlayerId === anchorId ? state.turnNumber + 2 : state.turnNumber + 1,
      };
    }
    case "until-end-of-action-phase":
      // "This action phase" is the current turn-player's current action phase,
      // fixed at generation (Jack Be Quick hit-steal). Atoms apply only while
      // that seat is still in the action phase; leaving it restores control.
      return {
        kind: "player-action-phase-window",
        playerId: state.activePlayerId,
        windowTurnNumber: state.turnNumber,
      };
    case "during-their-next-action-phase": {
      const controllerId = source.controllerId ?? source.ownerId;
      const theirId = state.playerIds.find((playerId) => playerId !== controllerId) ?? controllerId;
      return {
        kind: "player-action-phase-window",
        playerId: theirId,
        windowTurnNumber:
          state.activePlayerId === theirId ? state.turnNumber + 2 : state.turnNumber + 1,
      };
    }
    case "during-own-next-action-phase": {
      const controllerId = source.controllerId ?? source.ownerId;
      return {
        kind: "player-action-phase-window",
        playerId: controllerId,
        windowTurnNumber:
          state.activePlayerId === controllerId ? state.turnNumber + 2 : state.turnNumber + 1,
      };
    }
    case "during-own-next-end-phase": {
      const controllerId = source.controllerId ?? source.ownerId;
      return {
        kind: "player-end-phase-window",
        playerId: controllerId,
        windowTurnNumber:
          state.activePlayerId === controllerId ? state.turnNumber : state.turnNumber + 1,
      };
    }
    case "during-their-next-end-phase": {
      const controllerId = source.controllerId ?? source.ownerId;
      const theirId = state.playerIds.find((playerId) => playerId !== controllerId) ?? controllerId;
      return {
        kind: "player-end-phase-window",
        playerId: theirId,
        windowTurnNumber:
          state.activePlayerId === theirId ? state.turnNumber : state.turnNumber + 1,
      };
    }
    case "until-opponent-next-clash-resolves":
      return null;
    case "this-chain-link": {
      const current = state.combat?.chainLinkNumber ?? 0;
      const linkEstablished = state.combat?.open === true && state.combat.activeLink != null;
      return {
        kind: "combat-chain",
        combatNumber: linkEstablished ? current : current + 1,
      };
    }
    case "this-combat-chain":
      // CR 7.0: one combat chain until close. Layer generation sees
      // chainLinkNumber 0; the Attack Step then opens link 1. Link-scoped
      // equality would cease the grant before defend. Sentinel -1 = while open
      // (dropped at combat-chain-close).
      return { kind: "combat-chain", combatNumber: -1 };
    case "while-in-arena":
      return { kind: "source", ref: source.ref };
    case "permanent":
      return { kind: "permanent" };
    default:
      return null;
  }
}

export function canonicalEngineZone(zone: FabZone): (typeof FAB_ZONE_KINDS)[number] | null {
  return catalogZoneToEngine(zone);
}

export function equipmentDestination(object: FabObjectSnapshot): FabZone | null {
  const subtypes = object.current.typeBox.subtypes;
  const types = object.current.typeBox.types;
  if (subtypes.includes("Head")) return "equipment-head";
  if (subtypes.includes("Chest")) return "equipment-chest";
  if (subtypes.includes("Arms")) return "equipment-arms";
  if (subtypes.includes("Legs")) return "equipment-legs";
  // Weapons, off-hands, and quivers all seat in the weapon zones (CR 8.2).
  if (types.includes("Weapon") || subtypes.includes("Off-Hand") || subtypes.includes("Quiver")) {
    return "weapon";
  }
  return null;
}

/**
 * Read the live occupant of a weapon slot as a {@link FabWeaponOccupant} marker.
 * A two-hander bow is distinguished so the 8.2.15a quiver carve-out can apply.
 */
function weaponOccupantOf(
  state: FabRulesSnapshot,
  playerId: string,
  slot: "weapon1" | "weapon2",
): FabWeaponOccupant {
  const id = state.containers.zonesByPlayerId[playerId]?.[slot][0];
  if (!id) return null;
  const object = state.objects[id];
  if (!object) return null;
  return weaponOccupantForDefinition(
    state.cardDefinitions[object.canonicalId],
    treats2hSwordAs1h(state, playerId, snapshotObject(state, id, playerId, slot)),
  );
}

/**
 * Pick a free weapon seat for mid-game equip. `claimed` tracks seats already
 * assigned earlier in the same multi-equip proposal (Cindra equip-up-to-2),
 * carrying the real occupant facts (including bow and Perched) so a later
 * equip in the same proposal sees accurate seat state — not a generic
 * `1h-weapon` placeholder that loses the CR 8.2.15a quiver carve-out.
 * Delegates the CR 8.2.1b/2b/2c/10/15 reasoning to {@link resolveEquipSlot}.
 */
export function nextFreeWeaponSlot(
  state: FabRulesSnapshot,
  playerId: string,
  object: FabObjectSnapshot,
  claimed: ReadonlyMap<"weapon1" | "weapon2", FabWeaponOccupant> = new Map(),
): "weapon1" | "weapon2" | null {
  const player = state.players[playerId];
  if (!player) return null;
  const def = object.canonicalId ? state.cardDefinitions[object.canonicalId] : undefined;
  const seat = weaponOccupantForDefinition(def, treats2hSwordAs1h(state, playerId, object));
  const seatState = {
    weapon1: claimed.get("weapon1") ?? weaponOccupantOf(state, playerId, "weapon1"),
    weapon2: claimed.get("weapon2") ?? weaponOccupantOf(state, playerId, "weapon2"),
  };
  return resolveEquipSlot(seatState, seat);
}

/**
 * CR 8.5.41c / 8.5.35a: non-weapon equipment seats (Head/Chest/Arms/Legs) are
 * single-occupancy. Returns true if the player's matching seat already holds an
 * object. Weapon seats are handled separately via {@link nextFreeWeaponSlot}.
 */
export function nonWeaponEquipmentSeatOccupied(
  state: FabRulesSnapshot,
  playerId: string,
  destination: FabZone,
): boolean {
  if (destination === "weapon") return false;
  const engineZone = canonicalEngineZone(destination);
  if (!engineZone) return false;
  return (state.containers.zonesByPlayerId[playerId]?.[engineZone] ?? []).length > 0;
}

export function eventZoneForSnapshot(zone: FabObjectSnapshot["zone"]): FabZone | null {
  if (zone === "arena") return "permanent";
  if (zone === "unknown") return null;
  return zone;
}

export function fabZoneForSnapshot(zone: FabObjectSnapshot["zone"]): FabZone | null {
  if (zone === "arena") return "permanent";
  if (zone === "unknown") return null;
  return zone;
}

export function conditionHolds(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  condition: FabCondition,
): boolean {
  // Layer bindings often carry pre-move LKI snapshots from prior sequence steps
  // (pitch/banish/move with outputBinding). After a zone reset, those refs are no
  // longer in live state — inject the snapshots as LKI so binding-matches can
  // still evaluate power/color/etc. (Tuffnut "if it has 6 or more {p}").
  const bindingLki = Object.values(layer.bindings).flatMap(snapshotBindings);
  const event = layer.kind === "triggered" ? layer.triggeringEvent : null;
  const eventLki = event ? Object.values(event.bindings).flatMap(snapshotBindings) : [];
  const layerBindings = resolvedLayerBindings(layer);
  const eventBindings = resolvedEventBindings(event);
  return buildFabRulesViewWithLki(state, [
    layer.source,
    ...bindingLki,
    ...eventLki,
  ]).evaluateCondition(condition, {
    controllerId: layer.controllerId,
    source: layer.source.ref,
    subject: layer.source.ref,
    bindings: {
      objects: { ...layerBindings.objects, ...eventBindings.objects },
      numbers: { ...layerBindings.numbers, ...eventBindings.numbers },
      strings: { ...layerBindings.strings, ...eventBindings.strings },
    },
  });
}

function resolvedEventBindings(event: import("../events.ts").CommittedEvent | null): {
  objects: Record<string, readonly FabObjectRef[]>;
  numbers: Record<string, number>;
  strings: Record<string, string>;
} {
  const objects: Record<string, readonly FabObjectRef[]> = {};
  const numbers: Record<string, number> = {};
  const strings: Record<string, string> = {};
  if (!event) return { objects, numbers, strings };
  for (const [key, value] of Object.entries(event.bindings)) {
    if (isObjectSnapshot(value)) objects[key] = [value.ref];
    else if (typeof value === "number") numbers[key] = value;
    else if (typeof value === "string") strings[key] = value;
  }
  return { objects, numbers, strings };
}

/**
 * Resolve a layer-scoped amount (constants, event-amount, looked-at-this-way, …)
 * using the staged rules view and the layer's event bindings.
 *
 * Binding LKI is required when a prior sequence step moved the bound object
 * (discard/banish/move): zone reset bumps incarnation so live state no longer
 * answers the binding ref. Inject snapshots the same way {@link conditionHolds}
 * does (Graven Justaucorpse: gain {r} equal to discarded pitch).
 */
/** CR 1.8.10 locks layer-bound amounts when a floating applicator is generated.
 * `subject-property` is the future latched object's stat (Tear Limb "X is its
 * base {p}") and must stay unevaluated until application. */
/** Layer bindings (this-way cohorts, event-amount, X) vanish after the
 * generating layer leaves the stack. Lock those numbers at generation.
 * Live game-state counts (`cards-defending`, hand size) must keep evaluating. */
export function amountDependsOnLayerBindings(amount: FabSelectionCount | FabAmount): boolean {
  if (typeof amount === "number") return false;
  if (isQuantifier(amount)) return false;
  if (!("type" in amount)) return false;
  switch (amount.type) {
    case "count":
      return (
        typeof amount.what === "string" &&
        (amount.what.includes("this-way") ||
          amount.what === "resources-paid-this-way" ||
          amount.what === "counters-removed" ||
          amount.what === "counters-removed-for-cost" ||
          amount.what === "banished-for-cost")
      );
    case "event-amount":
    case "x":
    case "y":
    case "z":
      return true;
    case "conditional":
      return (
        amountDependsOnLayerBindings(amount.then) ||
        (amount.else !== undefined && amountDependsOnLayerBindings(amount.else))
      );
    case "sum":
    case "difference":
    case "negate":
    case "double":
      return (
        "operands" in amount && amount.operands.some((part) => amountDependsOnLayerBindings(part))
      );
    case "up-to":
      return amountDependsOnLayerBindings(amount.amount);
    default:
      return false;
  }
}

export function amountUsesFutureSubject(amount: FabSelectionCount | FabAmount): boolean {
  if (typeof amount === "number") return false;
  if (isQuantifier(amount)) return false;
  if (!("type" in amount)) return false;
  switch (amount.type) {
    case "subject-property":
      return true;
    case "conditional":
      return (
        amountUsesFutureSubject(amount.then) ||
        (amount.else !== undefined && amountUsesFutureSubject(amount.else))
      );
    case "sum":
    case "difference":
    case "negate":
    case "double":
      return "operands" in amount && amount.operands.some((part) => amountUsesFutureSubject(part));
    case "up-to":
      return amountUsesFutureSubject(amount.amount);
    default:
      return false;
  }
}

/**
 * Seat named by `playerTarget` / `playerTargetBinding` on an object target.
 * `unbound` means the hero parameter is still a player choice.
 */
export function objectTargetPlayerBinding(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  target: Extract<FabTarget, { selector: "object" }>,
  targetPath: string,
):
  | { readonly kind: "none" }
  | { readonly kind: "unbound" }
  | { readonly kind: "bound"; readonly playerId: string } {
  if (!target.playerTarget && !target.playerTargetBinding) return { kind: "none" };
  const declaredPlayerEntries = target.playerTargetBinding
    ? Object.entries(fabLayerTargets(layer)).filter(([key]) =>
        key.endsWith(`:player@${target.playerTargetBinding}`),
      )
    : [];
  const declaredPlayerTargets = target.playerTargetBinding
    ? (declaredPlayerEntries[0]?.[1] ?? [])
    : (fabLayerTargets(layer)[`${targetPath}:player`] ?? []);
  const declaredPlayerIds = declaredPlayerTargets.flatMap((entry) =>
    entry.kind === "player" ? [entry.playerId] : [],
  );
  if (
    declaredPlayerIds.length === 1 &&
    state.playerIds.some((playerId) => playerId === declaredPlayerIds[0])
  ) {
    return { kind: "bound", playerId: declaredPlayerIds[0]! };
  }
  return { kind: "unbound" };
}

/** Collapse a conditional selection count to the branch that currently holds. */
export function unwrapSelectionCount(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  count: FabSelectionCount,
): FabSelectionCount {
  if (typeof count !== "object" || count === null || count.type !== "conditional") return count;
  const amountContext = {
    controllerId: layer.controllerId,
    source: layer.source.ref,
    bindings: resolvedLayerBindings(layer),
  };
  try {
    const bindingLki = Object.values(layer.bindings).flatMap(snapshotBindings);
    const view = buildFabRulesViewWithLki(state, [layer.source, ...bindingLki]);
    const holds = view.evaluateCondition(count.condition, amountContext);
    return unwrapSelectionCount(state, layer, holds ? count.then : (count.else ?? 0));
  } catch {
    return count;
  }
}

/**
 * At-resolution object counts must be numeric (or a quantifier / up-to) before
 * the pool scan. Bound amounts such as `{ type: "x" }` stay opaque after
 * unwrapSelectionCount; evaluate them here so CR 1.8.6c can auto-bind.
 */
export function resolveAtResolutionSelectionCount(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  count: FabSelectionCount | undefined,
): FabSelectionCount | undefined {
  if (count === undefined) return undefined;
  const unwrapped = unwrapSelectionCount(state, layer, count);
  if (
    typeof unwrapped === "number" ||
    isQuantifierCountValue(unwrapped) ||
    isUpToCountValue(unwrapped)
  ) {
    return unwrapped;
  }
  return resolveLayerAmount(state, layer, unwrapped) ?? unwrapped;
}

export function resolveLayerAmount(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  amount: FabSelectionCount,
): number | null {
  if (typeof amount === "number") return amount;
  if (isQuantifier(amount)) return Number.POSITIVE_INFINITY;
  const amountContext = {
    controllerId: layer.controllerId,
    source: layer.source.ref,
    bindings: resolvedLayerBindings(layer),
  };
  if (isFabAmount(amount)) {
    try {
      // Flatten single snapshots and multi-object this-way arrays (banished-this-way).
      const bindingLki = Object.values(layer.bindings).flatMap(snapshotBindings);
      const resolved = buildFabRulesViewWithLki(state, [
        layer.source,
        ...bindingLki,
      ]).evaluateAmount(amount, amountContext);
      return typeof resolved.value === "number" && Number.isFinite(resolved.value)
        ? resolved.value
        : null;
    } catch {
      return null;
    }
  }
  if (amount.type === "conditional") {
    try {
      const bindingLki = Object.values(layer.bindings).flatMap(snapshotBindings);
      const view = buildFabRulesViewWithLki(state, [layer.source, ...bindingLki]);
      const holds = view.evaluateCondition(amount.condition, amountContext);
      return resolveLayerAmount(state, layer, holds ? amount.then : (amount.else ?? 0));
    } catch {
      return null;
    }
  }
  return null;
}

function isAllCountValue(count: FabSelectionCount | undefined): boolean {
  return typeof count === "object" && count !== undefined && count.type === "all";
}

function isAnyNumberCountValue(count: FabSelectionCount | undefined): boolean {
  return typeof count === "object" && count !== undefined && count.type === "any-number";
}

function isQuantifierCountValue(count: FabSelectionCount | undefined): boolean {
  return isAllCountValue(count) || isAnyNumberCountValue(count);
}

export function isUpToCountValue(count: FabSelectionCount | undefined): boolean {
  return typeof count === "object" && count !== undefined && count.type === "up-to";
}

function resolvedLayerBindings(layer: FabRulesStackLayer) {
  return resolveFabEventBindings(layer.bindings);
}

export function isExactAttackBinding(
  value: unknown,
): value is import("../events.ts").FabExactAttackBinding {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    value.kind === "exact-attack" &&
    "attack" in value &&
    "object" in value
  );
}

export function findObject(state: FabRulesSnapshot, instanceId: string): FabObjectSnapshot | null {
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const zone of FAB_ZONE_KINDS) {
      if (state.containers.zonesByPlayerId[playerId]![zone].includes(instanceId))
        return snapshotObject(state, instanceId, playerId, zone);
    }
  }
  for (const [hostId, subcardIds] of Object.entries(state.containers.subcardsByHostId)) {
    if (!subcardIds.includes(instanceId as (typeof subcardIds)[number])) continue;
    const host = state.objects[hostId];
    return snapshotObject(state, instanceId, host?.ownerId ?? state.playerIds[0]!, "under");
  }
  return null;
}

/** Follow bound objects to their live post-preview seats (banish resets incarnation). */
export function liveReanchorBindings(
  state: FabRulesSnapshot,
  bindings: ProposedEvent["bindings"],
): ProposedEvent["bindings"] {
  const next: Record<string, ProposedEvent["bindings"][string]> = { ...bindings };
  for (const [key, value] of Object.entries(bindings)) {
    if (isObjectSnapshot(value)) {
      const live = findObject(state, value.instanceId);
      if (live) next[key] = live;
      continue;
    }
    if (Array.isArray(value)) {
      next[key] = value.map((object) => findObject(state, object.instanceId) ?? object);
    }
  }
  return next;
}

export function isObjectSnapshot(value: unknown): value is FabObjectSnapshot {
  return (
    typeof value === "object" &&
    value !== null &&
    "instanceId" in value &&
    "ref" in value &&
    "base" in value &&
    "current" in value
  );
}

/**
 * Parent sequence that owns `effectPath`'s last index. Walks only through
 * nested `sequence` nodes — look-cohort (Index) is authored as look then
 * sequence(move-top, move-bottom).
 */
export function parentSequenceContext(
  layer: FabRulesStackLayer,
  effectPath: readonly number[],
): { steps: readonly FabEffect[]; index: number } | null {
  if (effectPath.length === 0) return null;
  let nodes: readonly FabEffect[] = effectsForLayer(layer);
  for (let depth = 0; depth < effectPath.length - 1; depth += 1) {
    const node = nodes[effectPath[depth]!];
    if (node?.type !== "sequence") return null;
    nodes = node.steps;
  }
  const index = effectPath[effectPath.length - 1];
  if (index === undefined || !nodes[index]) return null;
  return { steps: nodes, index };
}

/**
 * Index / look-N-then-put-1-on-top-rest-bottom: a binding move to deck top
 * whose next sibling is the same binding to deck bottom (or the reverse).
 */
export function lookCohortBindingRole(
  layer: FabRulesStackLayer,
  effectPath: readonly number[],
  effect: Extract<FabEffect, { type: "move-card" }>,
): "top-pick" | "bottom-rest" | null {
  if (effect.target.selector !== "binding") return null;
  if (effect.to.zone !== "deck") return null;
  const parent = parentSequenceContext(layer, effectPath);
  if (!parent) return null;
  const binding = effect.target.binding;
  const isSameBindingMove = (
    step: FabEffect | undefined,
    position: "top" | "bottom",
  ): step is Extract<FabEffect, { type: "move-card" }> =>
    step?.type === "move-card" &&
    step.target.selector === "binding" &&
    step.target.binding === binding &&
    step.to.zone === "deck" &&
    step.to.position === position;
  if (effect.to.position === "top" && isSameBindingMove(parent.steps[parent.index + 1], "bottom")) {
    return "top-pick";
  }
  if (effect.to.position === "bottom" && isSameBindingMove(parent.steps[parent.index - 1], "top")) {
    return "bottom-rest";
  }
  return null;
}

function matchingSearchPoolSize(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  effect: Extract<FabEffect, { type: "search" }>,
): number {
  const playerIds = playersForFabPlayer(
    state,
    layer.controllerId,
    effect.player ?? "controller",
    layer.bindings,
  );
  if (!playerIds || playerIds.length !== 1) return 0;
  const playerId = playerIds[0]!;
  let total = 0;
  for (const zoneName of effect.zones) {
    const engineZone = zoneName === "deck" ? "deck" : catalogZoneToEngine(zoneName);
    if (!engineZone) continue;
    const zone = state.containers.zonesByPlayerId[playerId]?.[engineZone] ?? [];
    for (const instanceId of zone) {
      const object = findObject(state, instanceId);
      if (
        object &&
        matchesFabSnapshotFilter(state, object, effect.filter, layer.bindings, layer.controllerId)
      ) {
        total += 1;
      }
    }
  }
  return total;
}

/** Search count, including printed "up to N" (Reel In) as a 0..N chooser. */
export function resolveSearchCount(
  state: FabRulesSnapshot,
  layer: FabRulesStackLayer,
  effect: Extract<FabEffect, { type: "search" }>,
): { count: number; upTo: boolean } | null {
  const spec = effect.count;
  const mayFail = effect.mayFail === true;
  if (spec === undefined) return { count: 1, upTo: mayFail };
  if (typeof spec === "number") {
    if (!Number.isFinite(spec) || spec < 0) return null;
    return { count: Math.floor(spec), upTo: mayFail };
  }
  if (isQuantifier(spec)) {
    const pool = matchingSearchPoolSize(state, layer, effect);
    if (spec.type === "all") return { count: pool, upTo: mayFail };
    return { count: pool, upTo: true };
  }
  if (isUpToCount(spec)) {
    const amount =
      typeof spec.amount === "number" ? spec.amount : resolveLayerAmount(state, layer, spec.amount);
    if (amount === null || !Number.isFinite(amount) || amount < 0) return null;
    return { count: Math.floor(amount), upTo: true };
  }
  const resolved = resolveLayerAmount(state, layer, spec);
  if (resolved === null || !Number.isFinite(resolved) || resolved < 0) return null;
  return { count: Math.floor(resolved), upTo: mayFail };
}

function snapshotBindings(value: unknown): readonly FabObjectSnapshot[] {
  if (isObjectSnapshot(value)) return [value];
  return Array.isArray(value) ? value.filter(isObjectSnapshot) : [];
}

function optionalId(value: string | undefined): readonly string[] | null {
  return value ? [value] : null;
}
