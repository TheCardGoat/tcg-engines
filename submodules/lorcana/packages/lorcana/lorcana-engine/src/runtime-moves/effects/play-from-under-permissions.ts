import type { PlayerId } from "#core";
import type {
  PlayFromUnderPermission,
  PlayFromUnderPermissionsState,
} from "../../types/runtime-state";
import { isEffectExpired } from "../../rules/effect-registry";

/** Read-only variant accepted by query functions */
type ReadonlyPlayFromUnderPermissionsState = {
  readonly permissionsByPlayer: Readonly<
    Record<PlayerId, readonly PlayFromUnderPermission[] | PlayFromUnderPermission[]>
  >;
};

/**
 * Add a play-from-under permission for a player.
 * Mutates the state in place for consistency with other effect helpers.
 */
export function addPlayFromUnderPermission(
  state: PlayFromUnderPermissionsState,
  playerId: PlayerId,
  permission: PlayFromUnderPermission,
): void {
  const existing = state.permissionsByPlayer[playerId];
  if (existing) {
    (existing as PlayFromUnderPermission[]).push(permission);
  } else {
    state.permissionsByPlayer[playerId] = [permission];
  }
}

/**
 * Get all active (non-expired) play-from-under permissions for a player.
 */
export function getActivePlayFromUnderPermissions(
  state: ReadonlyPlayFromUnderPermissionsState | undefined,
  playerId: PlayerId,
  currentTurn: number,
): PlayFromUnderPermission[] {
  if (!state) {
    return [];
  }
  const permissions = state.permissionsByPlayer[playerId];
  if (!permissions) {
    return [];
  }
  return (permissions as PlayFromUnderPermission[]).filter((p) => !isEffectExpired(p, currentTurn));
}

/**
 * Remove all expired permissions from the state.
 * Called during turn cleanup alongside other effect pruning.
 */
export function pruneExpiredPlayFromUnderPermissions(
  state: PlayFromUnderPermissionsState | undefined,
  currentTurn: number,
): void {
  if (!state) {
    return;
  }
  for (const playerId of Object.keys(state.permissionsByPlayer) as PlayerId[]) {
    const permissions = state.permissionsByPlayer[playerId];
    if (!permissions) {
      continue;
    }
    const active = (permissions as PlayFromUnderPermission[]).filter(
      (p) => !isEffectExpired(p, currentTurn),
    );
    if (active.length === 0) {
      delete state.permissionsByPlayer[playerId];
    } else {
      state.permissionsByPlayer[playerId] = active;
    }
  }
}
