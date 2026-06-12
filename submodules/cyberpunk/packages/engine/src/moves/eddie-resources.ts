import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { GameState } from "../types/index.ts";
import type { MatchState } from "../types/match-state.ts";

export function readyLegendEddieCount(state: MatchState, playerId: PlayerId): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;

  return player.zones.legendArea.filter((id) => {
    const card = state.G.cardIndex[id as string];
    return card && !card.meta.spent;
  }).length;
}

export function availableEddies(state: MatchState, playerId: PlayerId): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;
  return player.eddies + readyLegendEddieCount(state, playerId);
}

export function spendReadyLegendsForEddies(
  state: GameState,
  playerId: PlayerId,
  amount: number,
): CardInstanceId[] {
  if (amount <= 0) return [];

  const player = state.players[playerId as string];
  if (!player) return [];

  const spent: CardInstanceId[] = [];
  for (const cardId of player.zones.legendArea) {
    if (spent.length >= amount) break;
    const card = state.cardIndex[cardId as string];
    if (!card || card.meta.spent) continue;
    spent.push(cardId);
  }
  return spent;
}
