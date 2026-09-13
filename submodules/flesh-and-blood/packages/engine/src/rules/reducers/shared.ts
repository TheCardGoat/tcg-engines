import {
  catalogZoneToEngine as engineZone,
  engineZoneOrSelf,
  engineZoneToCatalog,
  isArenaZone,
} from "../zones.ts";
export { engineZone, engineZoneOrSelf, isArenaZone };
import type { FabZone } from "@tcg/flesh-and-blood-types";
import {
  type FabAttackTarget,
  type FabLkiId,
  type FabMatchState,
  type FabMoveLkiSnapshot,
  type FabZoneKind,
} from "../../state.ts";
import type { FabEventId, FabObjectSnapshot, ProposedEvent } from "../events.ts";
import type { FabObjectRef } from "../continuous/ir.ts";
import { nextFabDestinationRef, snapshotObject } from "../snapshots.ts";
import { buildFabRulesView } from "../state-rules-view.ts";
import { libraryPlayerId } from "../shared-library.ts";
import {
  fabCanonicalCardId,
  fabObjectInstanceId,
  fabPlayerId,
  type FabObjectInstanceId,
} from "../../game/identity.ts";
import { fabActiveFaceLocationForZone, resetFabActiveFace } from "../../game/active-face.ts";

/**
 * Helpers shared across multiple reducer domain modules. Each function here
 * is used by two or more domains; single-domain helpers stay in their owning
 * module. Nothing in this file writes rules-visible state on its own — it is
 * always called from inside a reducer case body operating on a cloned draft.
 */

export function nextEventId(state: Readonly<FabMatchState>): FabEventId {
  return `event-${state.counters.event + 1}`;
}

export function internMoveLki(
  state: FabMatchState,
  before: FabObjectSnapshot,
  canonicalId: string,
): FabLkiId {
  const lkiId: FabLkiId = `lki:${before.capturedAt}:${before.ref.instanceId}:${before.ref.incarnation}`;
  if (!state.lkiArena[lkiId]) {
    const snapshot: FabMoveLkiSnapshot = {
      objectKind: before.objectKind,
      baseSource: before.baseSource,
      ref: { ...before.ref, instanceId: fabObjectInstanceId(before.ref.instanceId) },
      canonicalId: fabCanonicalCardId(canonicalId),
      ownerId: fabPlayerId(before.ownerId),
      controllerId: before.controllerId === null ? null : fabPlayerId(before.controllerId),
      zone: before.zoneRef,
      base: before.base,
      copyable: before.copyable,
      baseNumeric: before.baseNumeric,
      current: before.current,
      counters: before.counterRecords,
      markers: before.markers,
      appliedEffectIds: before.appliedEffectIds,
    };
    state.lkiArena[lkiId] = snapshot;
  }
  return lkiId;
}

export function zoneVisibility(zone: FabZoneKind): "public" | "private" {
  // CR 4.1.6 inventory is private to its owner (Taylor / Librarian sideboard).
  return zone === "deck" || zone === "hand" || zone === "arsenal" || zone === "inventory"
    ? "private"
    : "public";
}

export function zonePreservesObject(zone: FabZoneKind): boolean {
  return (
    zone === "stack" ||
    zone === "combatChain" ||
    zone === "arena" ||
    zone === "head" ||
    zone === "chest" ||
    zone === "arms" ||
    zone === "legs" ||
    zone === "weapon1" ||
    zone === "weapon2" ||
    zone === "heroZone"
  );
}

export function setObjectMarker(
  state: FabMatchState,
  instanceId: string,
  kind: "face-down" | "tapped" | "frozen",
  present: boolean,
): void {
  const object = state.objects[instanceId];
  if (!object) return;
  const markers = object.markers.filter((marker) => marker.kind !== kind);
  state.objects[instanceId] = {
    ...object,
    markers: present ? [...markers, { kind }] : markers,
  };
}

export function setFaceDownMarker(
  state: FabMatchState,
  instanceId: string,
  faceDown: boolean,
): void {
  setObjectMarker(state, instanceId, "face-down", faceDown);
}

/**
 * CR 1.10.2b / 2.5.3f: non-hero living objects at 0 life are cleared as a
 * game-state action. Heroes lose the game instead (4.5.3a).
 */
/** UST Unique: personal moniker is the text before a comma, else the first word. */
export function fabPersonalMoniker(names: readonly string[]): string | null {
  const name = names[0]?.trim();
  if (!name) return null;
  const comma = name.indexOf(",");
  if (comma > 0) return name.slice(0, comma).trim().toLocaleLowerCase("en-US");
  const first = name.split(/\s+/)[0];
  return first ? first.toLocaleLowerCase("en-US") : null;
}

function uniqueKeepPriority(object: FabObjectSnapshot): number {
  if (object.current.typeBox.types.includes("Hero")) return 2;
  if (object.current.typeBox.types.includes("Demi-Hero")) return 1;
  return 0;
}

/**
 * UST Unique: you may control only one card with a given name or moniker.
 * Unique vs unique and unique vs non-unique the same moniker both clean up.
 * Heroes/demi-heroes outrank tokens so a Blasmophet token yields to
 * Blasmophet, Levia Consumed.
 */
export function uniqueMonikerClears(state: FabMatchState, cause: ProposedEvent): ProposedEvent[] {
  const view = buildFabRulesView(state);
  let resetOffset = 0;
  const events: ProposedEvent[] = [];
  for (const playerId of state.playerIds) {
    const zones = state.containers.zonesByPlayerId[playerId];
    if (!zones) continue;
    const controlled: FabObjectSnapshot[] = [];
    for (const zone of ["arena", "heroZone"] as const) {
      for (const instanceId of zones[zone]) {
        controlled.push(snapshotObject(state, instanceId, playerId, zone, view));
      }
    }
    const groups = new Map<string, FabObjectSnapshot[]>();
    for (const object of controlled) {
      const moniker = fabPersonalMoniker(object.current.names);
      if (!moniker) continue;
      const members = groups.get(moniker) ?? [];
      members.push(object);
      groups.set(moniker, members);
    }
    for (const members of groups.values()) {
      const hasUnique = members.some((object) =>
        object.current.keywords.some((keyword) => keyword.name === "unique"),
      );
      if (!hasUnique || members.length <= 1) continue;
      const keep = members.reduce((best, object) =>
        uniqueKeepPriority(object) >= uniqueKeepPriority(best) ? object : best,
      );
      for (const extra of members) {
        if (extra.instanceId === keep.instanceId) continue;
        events.push({
          ...cause,
          name: "destroy",
          affected: [extra],
          data: {
            object: extra,
            destinationRef: nextFabDestinationRef(state, extra, resetOffset++),
            from: extra.zone === "unknown" ? "permanent" : extra.zone,
            to: "graveyard",
            reason: "destroy",
          },
        });
      }
    }
  }
  return events;
}

export function livingObjectZeroLifeClears(
  state: FabMatchState,
  cause: ProposedEvent,
): ProposedEvent[] {
  const view = buildFabRulesView(state);
  let resetOffset = 0;
  return Object.values(state.objects).flatMap((record) => {
    const evaluated = view.object({
      instanceId: record.instanceId,
      incarnation: record.incarnation,
    });
    if (!evaluated) return [];
    if (evaluated.current.typeBox.types.includes("Hero")) return [];
    if (evaluated.current.numeric.life === undefined || evaluated.current.numeric.life > 0) {
      return [];
    }
    const ownerId = evaluated.controllerId ?? evaluated.ownerId;
    const zone = evaluated.zone.zone;
    const snapshot = snapshotObject(state, record.instanceId, ownerId, zone);
    return [
      {
        ...cause,
        name: "destroy" as const,
        affected: [snapshot],
        data: {
          object: snapshot,
          destinationRef: nextFabDestinationRef(state, snapshot, resetOffset++),
          from: engineZoneToCatalog(zone),
          to: "graveyard" as const,
          reason: "destroy" as const,
        },
      },
    ];
  });
}

export function endGameForLoser(state: FabMatchState, loserId: string, reason: string): void {
  state.gameEnded = true;
  state.winnerId = state.playerIds.find((playerId) => playerId !== loserId) ?? null;
  state.endReason = reason;
  state.decision = null;
}

export function validAttackTarget(
  state: FabMatchState,
  actorId: string,
  target: FabAttackTarget,
  defendingPlayerId: string,
): boolean {
  if (defendingPlayerId === actorId || !state.players[defendingPlayerId]) return false;
  if (target.kind === "hero") return target.playerId === defendingPlayerId;
  // CR 8.3.14b Spectra / CR 8.3 Usurp: spectra permanents and
  // usurp-targeted auras are destroyed during finalizePlay, before the
  // attack event resolves. Accept the target if it still exists in state
  // (moved to graveyard by the destroy in the same transaction).
  if (target.kind === "spectra" || target.kind === "permanent") {
    return (
      target.controllerId === defendingPlayerId &&
      state.objects[target.ref.instanceId] !== undefined
    );
  }
  return (
    target.controllerId === defendingPlayerId &&
    state.containers.zonesByPlayerId[defendingPlayerId]!.arena.includes(target.ref.instanceId) &&
    state.objects[target.ref.instanceId]?.incarnation === target.ref.incarnation
  );
}

export function moveKnownObject(
  state: FabMatchState,
  before: FabObjectSnapshot,
  from: FabZoneKind | FabZone,
  to: FabZoneKind | FabZone,
  destinationRef: FabObjectRef | null,
  position?: "top" | "bottom" | { readonly index: number },
  /** When set, destination zone is this player's (cross-player equip). */
  destinationPlayerId?: string | null,
  /** CR 3.0.14 host for a `to: "under"` destination ("under this"). */
  destinationHostId?: FabObjectInstanceId | null,
): boolean {
  const { instanceId } = before;
  const zonePlayerId = before.zoneRef.playerId ?? before.controllerId ?? before.ownerId;
  const object = state.objects[instanceId];
  const fromZone = engineZoneOrSelf(from);
  const toZone = engineZoneOrSelf(to);
  if (!object || !fromZone || !toZone) return false;
  // Yorick: deck/graveyard always live on the shared-library host seat.
  const sourcePlayerId = libraryPlayerId(state, zonePlayerId, fromZone);
  const destPlayerId = libraryPlayerId(state, destinationPlayerId ?? zonePlayerId, toZone);
  const player = state.players[sourcePlayerId];
  const destPlayer = state.players[destPlayerId];
  if (!player || !destPlayer) return false;
  // CR 3.0.14: a hosted sub-card's membership lives in the topology registry
  // (subcardsByHostId), not in any zonesByPlayerId list — resolve (and later
  // prune) its source seat through the host. Reordering within a host is not
  // expressible as a zone move.
  let sourceHostId: FabObjectInstanceId | null = null;
  if (fromZone === "under") {
    sourceHostId = hostOfSubcard(state, instanceId);
    if (sourceHostId === null) return false;
  } else if (toZone === "under") {
    // to-under requires an explicit host (CR 3.0.14a: "under" only by rule or
    // effect instruction); fail closed rather than guessing one.
    if (destinationHostId == null || !state.objects[destinationHostId]) return false;
    sourceHostId = hostOfSubcard(state, instanceId);
    if (sourceHostId !== null) return false;
  } else {
    const source = state.containers.zonesByPlayerId[sourcePlayerId]![fromZone];
    const index = source.indexOf(instanceId);
    if (index === -1) return false;
  }

  // Same-zone reposition (Arakni put looked top card on bottom, opt reorder, …).
  // No zone change, no incarnation bump, no visibility reset — only order.
  // Cross-player same engine-zone is still a real move, not a reorder.
  if (fromZone === toZone && destPlayerId === zonePlayerId) {
    if (position === undefined) return false;
    if (fromZone === "under") return false;
    const source = state.containers.zonesByPlayerId[sourcePlayerId]![fromZone];
    const index = source.indexOf(instanceId);
    if (index === -1) return false;
    source.splice(index, 1);
    if (position === "bottom") source.unshift(instanceId);
    else if (typeof position === "object") {
      source.splice(Math.max(0, Math.min(position.index, source.length)), 0, instanceId);
    } else source.push(instanceId);
    state.objects[instanceId] = {
      ...object,
      history: {
        moves: [
          ...object.history.moves,
          {
            from: { playerId: fabPlayerId(zonePlayerId), zone: fromZone },
            to: { playerId: fabPlayerId(destPlayerId), zone: toZone },
            eventId: nextEventId(state),
            turnNumber: state.turnNumber,
            combatNumber: state.players[zonePlayerId]?.history.combatChain.combatNumber ?? null,
            chainLinkNumber: state.players[zonePlayerId]?.history.chainLink.chainLinkNumber ?? null,
            lki: internMoveLki(state, before, before.canonicalId ?? object.canonicalId),
          },
        ],
      },
    };
    return true;
  }

  const resetsObject = !zonePreservesObject(toZone);
  const definition = state.cardDefinitions[object.canonicalId];
  if (!definition) return false;
  // CR 3.0.9: destination identity is determined when the move occurs.
  // Proposal-time destinationRefs go stale when a preceding replacement
  // creates objects (Vestige of Flagellation rewriting gain-life into
  // lose-life + N tokens, then the resolving card leaving the stack).
  const liveNextIncarnation = state.counters.objectIncarnation + 1;
  if (
    resetsObject !== (destinationRef !== null) ||
    (destinationRef !== null && destinationRef.instanceId !== instanceId)
  )
    return false;
  if (fromZone === "under" && sourceHostId !== null) {
    removeUnderSubcard(state, sourceHostId, instanceId);
  } else {
    const source = state.containers.zonesByPlayerId[sourcePlayerId]![fromZone];
    const index = source.indexOf(instanceId);
    if (index === -1) return false;
    source.splice(index, 1);
  }
  // A hosted destination has no zone-list membership (CR 3.0.14b: the sub-card
  // is not in the arena); its seat is the topology registry alone. Visibility
  // follows the host, mirroring transform attachment.
  const destinationHost =
    toZone === "under" && destinationHostId != null ? state.objects[destinationHostId] : null;
  if (toZone !== "under") {
    const destination = state.containers.zonesByPlayerId[destPlayerId]![toZone];
    if (position === "bottom") destination.unshift(instanceId);
    else if (typeof position === "object") {
      destination.splice(Math.max(0, Math.min(position.index, destination.length)), 0, instanceId);
    } else destination.push(instanceId);
  }
  const nextIncarnation = destinationRef ? liveNextIncarnation : object.incarnation;
  if (destinationRef) state.counters.objectIncarnation = liveNextIncarnation;
  state.objects[instanceId] = {
    ...object,
    incarnation: nextIncarnation,
    visibility:
      toZone === "under" ? (destinationHost?.visibility ?? "public") : zoneVisibility(toZone),
    activeFace: resetsObject
      ? resetFabActiveFace(definition, object.activeFace, fabActiveFaceLocationForZone(toZone))
      : object.activeFace,
    cardPropertyState: resetsObject ? { kind: "whole-card" } : object.cardPropertyState,
    declarationFacts: resetsObject ? [] : object.declarationFacts,
    counters: resetsObject ? [] : object.counters,
    markers: resetsObject ? [] : object.markers,
    history: {
      moves: [
        ...object.history.moves,
        {
          from:
            fromZone === "under"
              ? { playerId: null, zone: "under" }
              : { playerId: fabPlayerId(zonePlayerId), zone: fromZone },
          to:
            toZone === "under"
              ? { playerId: null, zone: "under" }
              : { playerId: fabPlayerId(destPlayerId), zone: toZone },
          eventId: nextEventId(state),
          turnNumber: state.turnNumber,
          combatNumber: state.players[zonePlayerId]?.history.combatChain.combatNumber ?? null,
          chainLinkNumber: state.players[zonePlayerId]?.history.chainLink.chainLinkNumber ?? null,
          lki: internMoveLki(state, before, before.canonicalId ?? object.canonicalId),
        },
      ],
    },
  };
  if (fromZone === "soul") removeSoulSubcard(state, sourcePlayerId, instanceId);
  if (toZone === "soul") appendSoulSubcard(state, destPlayerId, instanceId);
  if (toZone === "under" && destinationHostId != null) {
    appendUnderSubcard(state, destinationHostId, instanceId);
  }
  // CR 8.3.41 watery grave: when the permanent is put into the graveyard
  // from the arena it is turned face-down. The combat chain is part of the
  // arena (CR 2.3), so defending cards — including defense reactions played
  // to the chain from hand — enter the graveyard from "combat-chain".
  if (isArenaZone(fromZone) && toZone === "graveyard") {
    const hasWateryGrave = before.current.keywords.some(
      (keyword) => keyword.name === "watery-grave",
    );
    if (hasWateryGrave) setFaceDownMarker(state, instanceId, true);
  }
  return true;
}

function soulHostId(state: FabMatchState, playerId: string): string {
  return state.containers.zonesByPlayerId[playerId]?.heroZone[0] ?? `soul:${playerId}`;
}

function removeSoulSubcard(state: FabMatchState, playerId: string, instanceId: string): void {
  const hostId = soulHostId(state, playerId);
  const subcards = state.containers.subcardsByHostId[hostId];
  if (!subcards) return;
  const index = subcards.indexOf(fabObjectInstanceId(instanceId));
  if (index >= 0) subcards.splice(index, 1);
  if (subcards.length === 0) delete state.containers.subcardsByHostId[hostId];
}

function appendSoulSubcard(state: FabMatchState, playerId: string, instanceId: string): void {
  const hostId = soulHostId(state, playerId);
  const subcards = state.containers.subcardsByHostId[hostId] ?? [];
  const objectId = fabObjectInstanceId(instanceId);
  if (!subcards.includes(objectId)) subcards.push(objectId);
  state.containers.subcardsByHostId[hostId] = subcards;
}

/** CR 3.0.14: the host whose subcardsByHostId list seats this sub-card. */
function hostOfSubcard(state: FabMatchState, instanceId: string): FabObjectInstanceId | null {
  const objectId = fabObjectInstanceId(instanceId);
  for (const [hostId, subcards] of Object.entries(state.containers.subcardsByHostId)) {
    if (subcards.some((id) => id === objectId)) return fabObjectInstanceId(hostId);
  }
  return null;
}

function removeUnderSubcard(
  state: FabMatchState,
  hostId: FabObjectInstanceId,
  instanceId: string,
): void {
  const subcards = state.containers.subcardsByHostId[hostId];
  if (!subcards) return;
  const index = subcards.indexOf(fabObjectInstanceId(instanceId));
  if (index >= 0) subcards.splice(index, 1);
  // Empty host entries violate the hosted-topology invariant.
  if (subcards.length === 0) delete state.containers.subcardsByHostId[hostId];
}

function appendUnderSubcard(
  state: FabMatchState,
  hostId: FabObjectInstanceId,
  instanceId: string,
): void {
  const subcards = state.containers.subcardsByHostId[hostId] ?? [];
  const objectId = fabObjectInstanceId(instanceId);
  if (!subcards.includes(objectId)) subcards.push(objectId);
  state.containers.subcardsByHostId[hostId] = subcards;
}
