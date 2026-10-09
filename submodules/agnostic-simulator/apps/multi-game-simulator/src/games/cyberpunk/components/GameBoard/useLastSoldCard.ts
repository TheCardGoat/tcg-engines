import { useMemo } from "react";
import { createCardCatalog } from "@tcg/cyberpunk-cards";
import type { MoveLogEntry, Side } from "../../engine";

export interface LastSoldCard {
  id: number;
  cardId: string;
  cardName: string;
  side: Side;
}

const soldCardArtByName = new Map(
  [...createCardCatalog().entries()].map(([, definition]) => [
    definition.displayName,
    definition.imageUrl,
  ]),
);

/** A Sell log reveals the card publicly even after it enters the face-down Eddies area. */
export function soldCardImageUrl(cardName: string): string | undefined {
  return soldCardArtByName.get(cardName);
}

/**
 * Whether the persistent "sell here" reminder appears on the local player's
 * eddies row. It follows the turn and phase gates for the normal Sell action,
 * but stays visible without a Sell-tag card in hand: the player may draw one
 * later this turn. Selling also does not depend on unspent Eddies.
 */
export interface SellCueInput {
  isOwnTurn: boolean;
  isMainPhase: boolean;
  gameEnded: boolean;
  soldThisTurn: boolean;
  attackInProgress: boolean;
}

export function canShowSellCue(input: SellCueInput): boolean {
  return (
    input.isOwnTurn &&
    input.isMainPhase &&
    !input.gameEnded &&
    !input.soldThisTurn &&
    !input.attackInProgress
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
