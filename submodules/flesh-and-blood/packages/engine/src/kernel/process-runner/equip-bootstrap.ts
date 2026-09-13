import type { FabMatchState } from "../../state.ts";
import type { FabProcessId, ProposedEvent } from "../../rules/events.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { fabTriggerObservesEvent } from "../../rules/trigger-patterns.ts";

export const EQUIP_ZONE_KINDS = ["head", "chest", "arms", "legs", "weapon1", "weapon2"] as const;

export function equipmentListensForEquip(state: FabMatchState, canonicalId: string): boolean {
  // Scan base abilities via object records (already loaded), not raw registry.
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const zone of EQUIP_ZONE_KINDS) {
      for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone]) {
        const record = state.objects[instanceId];
        if (!record || record.canonicalId !== canonicalId) continue;
        const object = snapshotObject(state, instanceId, playerId, zone);
        return object.base.abilities.some(
          (ability) =>
            ability.kind === "static" &&
            ability.staticKind === "triggered" &&
            fabTriggerObservesEvent(ability.trigger, "equip"),
        );
      }
    }
  }
  return false;
}

export function markNonListeningEquipmentObserved(state: FabMatchState): void {
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const zone of EQUIP_ZONE_KINDS) {
      for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone]) {
        const record = state.objects[instanceId];
        if (!record) continue;
        if (
          record.markers.some(
            (marker) => marker.kind === "status" && marker.value === "equip-observed",
          )
        ) {
          continue;
        }
        if (equipmentListensForEquip(state, record.canonicalId)) continue;
        state.objects[instanceId] = {
          ...record,
          markers: [...record.markers, { kind: "status", value: "equip-observed" }],
        };
      }
    }
  }
}

/**
 * Propose `equip` events for equipment already in equipment zones that has
 * never recorded an equip (start-of-game seating) and that listens for equip.
 */
export function proposeStartingEquipEvents(
  state: FabMatchState,
  processId: FabProcessId,
): ProposedEvent[] {
  const events: ProposedEvent[] = [];
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const zone of EQUIP_ZONE_KINDS) {
      for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone]) {
        const record = state.objects[instanceId];
        if (!record) continue;
        if (
          record.markers.some(
            (marker) => marker.kind === "status" && marker.value === "equip-observed",
          )
        ) {
          continue;
        }
        if (!equipmentListensForEquip(state, record.canonicalId)) continue;
        const object = snapshotObject(state, instanceId, playerId, zone);
        const to =
          zone === "weapon1" || zone === "weapon2"
            ? ("weapon" as const)
            : zone === "head"
              ? ("equipment-head" as const)
              : zone === "chest"
                ? ("equipment-chest" as const)
                : zone === "arms"
                  ? ("equipment-arms" as const)
                  : ("equipment-legs" as const);
        events.push({
          name: "equip",
          processId,
          cause: { kind: "rule", rule: "start-of-game-equip", controllerId: playerId },
          controllerId: playerId,
          source: object,
          affected: [object],
          bindings: {},
          data: {
            playerId,
            object,
            destinationRef: null,
            from: "unknown",
            to,
            reason: "equip",
            ...(zone === "weapon1" || zone === "weapon2"
              ? { equipmentSlot: zone as "weapon1" | "weapon2" }
              : {}),
          },
        });
      }
    }
  }
  return events;
}

/**
 * Runs one persisted rules transaction until it reaches a trigger declaration
 * checkpoint or settles back at ordinary priority.
 */
