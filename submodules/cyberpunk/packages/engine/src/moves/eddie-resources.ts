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

  const readyLegends = player.zones.legendArea.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return card && !card.meta.spent;
  });
  const faceDownLegends = readyLegends.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return card?.meta.faceDown;
  });
  const faceUpLegends = readyLegends.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return !card?.meta.faceDown;
  });

  const spent: CardInstanceId[] = [];
  for (const cardId of [...faceDownLegends, ...faceUpLegends]) {
    if (spent.length >= amount) break;
    spent.push(cardId);
  }
  return spent;
}
