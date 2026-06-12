import { useMemo } from "react";
import type { MoveLogEntry, Side } from "../../engine";

export interface LastSoldCard {
  id: number;
  cardId: string;
  cardName: string;
  side: Side;
}

export function useLastSoldCardForSide(
  moveLogs: ReadonlyArray<MoveLogEntry>,
  side: Side,
): LastSoldCard | null {
  return useMemo(() => {
    for (let i = moveLogs.length - 1; i >= 0; i -= 1) {
      const entry = moveLogs[i];
      if (!entry || entry.side !== side || entry.log.type !== "sellCard") {
        continue;
      }
      return {
        id: entry.id,
        side,
        cardId: String(entry.log.cardId),
        cardName: entry.log.cardName,
      };
    }
    return null;
  }, [moveLogs, side]);
}
