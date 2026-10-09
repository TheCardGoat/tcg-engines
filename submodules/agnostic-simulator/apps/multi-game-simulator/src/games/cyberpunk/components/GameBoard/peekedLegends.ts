import { useMemo } from "react";
import { PLAYER_SIDE_TO_ID, type MoveLogEntry, type Side } from "../../engine";

export interface PeekedLegends {
  ids: ReadonlySet<string>;
  indexes: ReadonlySet<number>;
}

/** Cards a player may still inspect after a Legend peek resolves this turn. */
export function usePeekedLegendsForSide(
  moveLogs: ReadonlyArray<MoveLogEntry>,
  side: Side,
  turnNumber: number,
): PeekedLegends {
  const ownerId = String(PLAYER_SIDE_TO_ID[side]);
  return useMemo(() => {
    const ids = new Set<string>();
    const indexes = new Set<number>();
    for (const entry of moveLogs) {
      const log = entry.log;
      if (
        log.type === "lookAtCards" &&
        log.turnNumber === turnNumber &&
        log.zone === "legendArea" &&
        log.ownerId === ownerId &&
        Array.isArray(log.cardIds)
      ) {
        for (const cardId of log.cardIds) ids.add(cardId);
        continue;
      }
      if (
        log.type !== "action" ||
        log.turnNumber !== turnNumber ||
        log.messageKey !== "trigger.targetResolved" ||
        log.params.sourceCardName !== "Kiroshi Optics" ||
        log.params.targetKind !== "legend" ||
        log.params.targetZone !== "legendArea" ||
        log.params.targetOwnerId !== ownerId ||
        typeof log.params.targetNames !== "string"
      )
        continue;
      if (typeof log.params.targetId === "string") ids.add(log.params.targetId);
      if (typeof log.params.targetIndex === "number") indexes.add(log.params.targetIndex);
    }
    return { ids, indexes };
  }, [moveLogs, ownerId, turnNumber]);
}
