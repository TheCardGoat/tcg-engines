import type { CardInstanceId, PlayerId } from "#core";
import type {
  PlayFromDiscardPermission,
  PlayFromDiscardPermissionsState,
} from "../../types/runtime-state";
import { isEffectExpired } from "../../rules/effect-registry";

type ReadonlyPlayFromDiscardPermissionsState = {
  readonly permissionsByPlayer: Readonly<
    Record<PlayerId, readonly PlayFromDiscardPermission[] | PlayFromDiscardPermission[]>
  >;
};

export function addPlayFromDiscardPermission(
  state: PlayFromDiscardPermissionsState,
  playerId: PlayerId,
  permission: PlayFromDiscardPermission,
): void {
  const existing = state.permissionsByPlayer[playerId];
  if (existing) {
    existing.push(permission);
  } else {
    state.permissionsByPlayer[playerId] = [permission];
  }
}

export function getActivePlayFromDiscardPermissions(
  state: ReadonlyPlayFromDiscardPermissionsState | undefined,
  playerId: PlayerId,
  currentTurn: number,
): PlayFromDiscardPermission[] {
  if (!state) {
    return [];
  }
  const permissions = state.permissionsByPlayer[playerId];
  if (!permissions) {
    return [];
  }
  return (permissions as PlayFromDiscardPermission[]).filter(
    (p) => !isEffectExpired(p, currentTurn),
  );
}

export function hasActivePlayFromDiscardPermission(
  state: ReadonlyPlayFromDiscardPermissionsState | undefined,
  playerId: PlayerId,
  cardId: CardInstanceId,
  currentTurn: number,
): boolean {
  return getActivePlayFromDiscardPermissions(state, playerId, currentTurn).some(
    // Player-wide permissions (allCards) cover any card, not just their
    // ability source recorded in cardId.
    (permission) => permission.allCards === true || permission.cardId === cardId,
  );
}

export function consumePlayFromDiscardPermission(
  state: PlayFromDiscardPermissionsState,
  playerId: PlayerId,
  permission: PlayFromDiscardPermission,
): void {
  const permissions = state.permissionsByPlayer[playerId];
  if (!permissions) {
    return;
  }

  // Player-wide permissions (e.g. Remember Me: "for the rest of this turn")
  // persist for their duration — they are not consumed by a single play.
  if (permission.allCards === true) {
    return;
  }

  const permissionIndex = permissions.indexOf(permission);
  if (permissionIndex === -1) {
    return;
  }

  permissions.splice(permissionIndex, 1);
  if (permissions.length === 0) {
    delete state.permissionsByPlayer[playerId];
  }
}

export function pruneExpiredPlayFromDiscardPermissions(
  state: PlayFromDiscardPermissionsState | undefined,
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
    const active = permissions.filter((p) => !isEffectExpired(p, currentTurn));
    if (active.length === 0) {
      delete state.permissionsByPlayer[playerId];
    } else {
      state.permissionsByPlayer[playerId] = active;
    }
  }
}
