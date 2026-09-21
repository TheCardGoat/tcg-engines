import type { Operations } from "../operations/index.ts";
import { tryDefOf } from "../state/lookups.ts";
import type { CardInstanceId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";

/** CR 5.13.1 — keep the instance in a public removed pile instead of deleting it. */
export function removeFromGame(
  state: MatchState,
  operations: Operations,
  cardId: CardInstanceId,
): void {
  const card = state.G.cardIndex[cardId as string];
  if (!card) return;
  if (card.zone === "removedFromGame") return;
  operations.zone.moveCard(cardId, "removedFromGame", card.ownerId);
}

/** CR 4.4.1 / 11.25.1 — GO SOLO Legends leave the field into the removed pile. */
export function removeFromGameIfGoSolo(
  state: MatchState,
  operations: Operations,
  cardId: CardInstanceId,
): void {
  const card = state.G.cardIndex[cardId as string];
  if (!card) return;
  const def = tryDefOf(card);
  if (!def?.keywords?.includes("goSolo")) return;
  removeFromGame(state, operations, cardId);
}
