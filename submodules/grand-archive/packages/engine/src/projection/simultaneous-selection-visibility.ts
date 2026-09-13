import type { GrandArchiveMatchState } from "../game/model.ts";
import type { GrandArchivePlayerId, GrandArchiveTargetId } from "../game/identity.ts";
import { GRAND_ARCHIVE_PRIVATE_ZONES } from "../game/zones.ts";

export interface GrandArchivePublicSimultaneousSelection {
  readonly playerId: GrandArchivePlayerId;
  readonly targetIds: readonly GrandArchiveTargetId[];
}

/** Public choices are disclosed to later choosers; hidden-zone and face-down choices are not. */
export function grandArchiveSimultaneousSelectionIsPublic(
  state: GrandArchiveMatchState,
  targetIds: readonly GrandArchiveTargetId[],
): boolean {
  if (targetIds.length === 0) return false;
  const objectsById = new Map(
    Object.values(state.objects).map((object) => [String(object.id), object]),
  );
  const playerIds = new Set(Object.keys(state.players).map(String));
  const stackIds = new Set(state.stack.map((item) => String(item.id)));
  return targetIds.every((targetId) => {
    const object = objectsById.get(String(targetId));
    if (object) {
      return (
        !(GRAND_ARCHIVE_PRIVATE_ZONES as readonly string[]).includes(object.zone) &&
        object.facing === "face-up"
      );
    }
    return playerIds.has(String(targetId)) || stackIds.has(String(targetId));
  });
}
