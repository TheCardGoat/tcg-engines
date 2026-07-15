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
    (permission) => permission.cardId === cardId,
  );
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
