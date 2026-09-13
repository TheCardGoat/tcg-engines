import type { FabMatchState } from "./state.ts";
import { playerIdsForCanonicalPlayer } from "./rules/condition-evaluator.ts";
import { FAB_MATCH_SCHEMA_VERSION } from "./state.ts";
import type { FabRulesSnapshot } from "./kernel/transaction-kernel.ts";
import type { FabTargetMap } from "./rules/targets.ts";
import { collectReachableFabLkiIds } from "./game/lki.ts";
import type { FabLkiId } from "./game/objects.ts";
import { currentFabState } from "./copy-on-write.ts";
import { profileFabOperation } from "./performance-observer.ts";

export const PUBLIC_OBJECT_TARGET_ZONES = new Set([
  "hero",
  "permanent",
  "arena",
  "combat-chain",
  "stack",
  "weapon",
  // CR 1.8.5a: a targeted effect that names a public zone may select public
  // objects there (graveyard, face-up banished, face-up arsenal).
  "arsenal",
  "graveyard",
  "banished",
]);

/** Zones whose seat player controls an object seated there. A discrete
 * control change (give/steal) re-seats the object into the controller's
 * zone, so the live seat — not the ownerId — answers "who controls this". */
const CONTROL_ZONE_KINDS = new Set([
  "arena",
  "combatChain",
  "stack",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
  "heroZone",
]);

/** Current controller seat of an object from raw state: the player whose
 * control zone seats it, falling back to the owner for uncontrolled zones
 * (deck/hand/… always answer their owner). Hosted sub-cards follow their
 * host's seat (CR 3.0.14). */
export function objectControllerSeat(state: FabMatchState, instanceId: string): string | null {
  for (const subcards of Object.values(state.containers.subcardsByHostId)) {
    if (subcards.some((id) => id === instanceId)) {
      const host = Object.entries(state.containers.subcardsByHostId).find(([, ids]) =>
        ids.some((id) => id === instanceId),
      );
      return host ? objectControllerSeat(state, host[0]) : null;
    }
  }
  for (const playerId of state.playerIds) {
    for (const [zone, ids] of Object.entries(state.containers.zonesByPlayerId[playerId] ?? {})) {
      if (ids.includes(instanceId)) {
        return CONTROL_ZONE_KINDS.has(zone) ? playerId : null;
      }
    }
  }
  return null;
}

/** First declared object/player is the printed “they” for later target-controller scans. */
export function targetControllerFromDeclaredTargets(
  state: FabMatchState,
  declared: FabTargetMap | undefined,
): string | undefined {
  if (!declared) return undefined;
  for (const refs of Object.values(declared)) {
    for (const ref of refs) {
      if (ref.kind === "player") return ref.playerId;
      const instanceId = ref.ref.instanceId;
      // Control follows the live seat (steal/give re-seat the object);
      // ownerId is the fallback for uncontrolled-zone objects, whose
      // controller is their owner by default.
      const controller = objectControllerSeat(state, instanceId);
      if (controller) return controller;
      const live = state.objects[instanceId];
      if (typeof live?.ownerId === "string") return live.ownerId;
    }
  }
  return undefined;
}

export function seatsForUnrestrictedObjectTarget(
  state: FabMatchState,
  controllerId: string,
  player: import("@tcg/flesh-and-blood-types").FabPlayer | undefined,
  zones: readonly string[],
  bindings: Readonly<Record<string, unknown>> | undefined,
): readonly string[] {
  const explicit = playerIdsForCanonicalPlayer(state, controllerId, player, bindings);
  if (player) return explicit;
  if (zones.some((zone) => PUBLIC_OBJECT_TARGET_ZONES.has(zone))) return state.playerIds;
  return explicit;
}

export function filterWantsControlledDagger(filter: unknown): boolean {
  if (!filter || typeof filter !== "object") return false;
  const record = filter as {
    subtypes?: readonly string[];
    typeBox?: { subtypes?: readonly string[] };
  };
  return (
    record.subtypes?.includes("Dagger") === true ||
    record.typeBox?.subtypes?.includes("Dagger") === true
  );
}

export function isCurrentFabSnapshot(value: unknown): value is FabRulesSnapshot {
  return (
    typeof value === "object" &&
    value !== null &&
    "schemaVersion" in value &&
    (value as { readonly schemaVersion?: unknown }).schemaVersion === FAB_MATCH_SCHEMA_VERSION &&
    typeof (value as { readonly lkiArena?: unknown }).lkiArena === "object" &&
    (value as { readonly lkiArena?: unknown }).lkiArena !== null
  );
}

export function runtimeIsTestProcess(): boolean {
  return (
    (globalThis as { readonly process?: { readonly env?: { readonly NODE_ENV?: string } } }).process
      ?.env?.NODE_ENV === "test"
  );
}

/**
 * Finalize the command candidate's revision: bump the state ID, re-stamp the
 * pending decision's version, and garbage-collect LKI entries no longer
 * reachable from live state.
 */
export function finalizeFabCommandStateVersion(draft: FabMatchState, stateID: number): void {
  // Version fields cannot alter LKI reachability. Traverse the immutable
  // state before opening the final Mutative draft so the recursive scan does
  // not pay proxy overhead for every nested rules fact.
  const reachableLki = profileFabOperation("lki:collect-reachable", () =>
    collectReachableFabLkiIds(currentFabState(draft)),
  );
  draft.stateID = stateID;
  if (draft.decision) draft.decision = { ...draft.decision, stateVersion: stateID };
  for (const lkiId of Object.keys(draft.lkiArena) as FabLkiId[]) {
    if (!reachableLki.has(lkiId)) delete draft.lkiArena[lkiId];
  }
}
