import { useMemo } from "react";
import type { MoveLogEntry, Side } from "../../engine";

export interface LastSoldCard {
  id: number;
  cardId: string;
  cardName: string;
  side: Side;
}

/**
 * Whether the persistent "sell here" slot cue may advertise on the local
 * player's eddies row. Mirrors the engine's `sellCardMove.available` gates
 * (main phase, own turn, no attack in progress, not already sold, a Sell-tag
 * card in hand). Deliberately takes no eddie counts: selling is legal with
 * every Eddie spent — it adds a fresh Eddie instead of spending one.
 */
export interface SellCueInput {
  isOwnTurn: boolean;
  isMainPhase: boolean;
  gameEnded: boolean;
  soldThisTurn: boolean;
  attackInProgress: boolean;
  hasSellableCardInHand: boolean;
}

export function canShowSellCue(input: SellCueInput): boolean {
  return (
    input.isOwnTurn &&
    input.isMainPhase &&
    !input.gameEnded &&
    !input.soldThisTurn &&
    !input.attackInProgress &&
    input.hasSellableCardInHand
  );
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
