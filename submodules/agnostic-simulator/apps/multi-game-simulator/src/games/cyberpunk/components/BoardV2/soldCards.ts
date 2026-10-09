import type { MoveLogEntry, Side } from "../../engine";
import { soldCardImageUrl } from "../GameBoard/useLastSoldCard";

export interface SoldCardReceipt {
  cardId: string;
  cardName: string;
  imageUrl?: string;
  turnNumber: number;
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") return value.split(", ").filter(Boolean);
  return [];
}

/**
 * The public face of every card this side sold THIS TURN that is still banked
 * in the Eddies area, drawn from the sell logs that reveal each sale. The rail
 * shows these faces INSTEAD of a face-down miniature of the same card, so one
 * sold card renders exactly once: as the revealed artwork the sale announced.
 * Once the turn ends the receipt is withdrawn and the card hides back into a
 * face-down Eddie miniature.
 */
export function soldCardReceipts(
  moveLogs: ReadonlyArray<MoveLogEntry>,
  eddieCardIds: ReadonlySet<string>,
  side: Side,
  currentTurnNumber: number,
): SoldCardReceipt[] {
  const receipts = new Map<string, SoldCardReceipt>();
  for (const { side: logSide, log } of moveLogs) {
    if (log.turnNumber !== currentTurnNumber) continue;
    if (log.type === "sellCard") {
      const cardId = String(log.cardId);
      if (logSide !== side || !eddieCardIds.has(cardId) || !log.cardName) continue;
      receipts.set(cardId, {
        cardId,
        cardName: log.cardName,
        imageUrl: soldCardImageUrl(log.cardName),
        turnNumber: log.turnNumber,
      });
      continue;
    }
    if (log.type !== "action" || log.messageKey !== "effect.sellFromDeck.resolved") continue;
    if (logSide !== side) continue;
    const ids = stringList(log.params.soldCardIdsList ?? log.params.soldCardIds);
    const names = stringList(log.params.soldCardNamesList ?? log.params.soldCardNames);
    for (const [index, cardId] of ids.entries()) {
      const cardName = names[index];
      if (!cardName || !eddieCardIds.has(cardId)) continue;
      receipts.set(cardId, {
        cardId,
        cardName,
        imageUrl: soldCardImageUrl(cardName),
        turnNumber: log.turnNumber,
      });
    }
  }
  return [...receipts.values()];
}
