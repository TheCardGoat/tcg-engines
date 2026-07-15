import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import type { Operations } from "../operations/index.ts";
import { rollDie } from "../types/gig-die.ts";

export function startTurn(
  state: MatchState,
  playerId: PlayerId,
  operations: Operations,
  rng: () => number,
): void {
  // Step 1: Ready spent cards.
  const player = state.G.players[playerId as string];
  const zonesToReady: ("field" | "legendArea" | "eddieArea")[] = [
    "field",
    "legendArea",
    "eddieArea",
  ];
  for (const zone of zonesToReady) {
    const cardIds = player?.zones[zone] ?? [];
    for (const cardId of cardIds) {
      operations.card.ready(cardId);
    }
  }
  if (player && (player.spentEddies ?? 0) > 0) {
    player.eddies += player.spentEddies;
    player.spentEddies = 0;
  }

  // Step 2: Draw a card.
  operations.zone.drawCards(playerId, 1);

  // Step 3: Gain a gig.
  if (player && player.fixerArea.length > 0) {
    const nonD20 = player.fixerArea.find((dieId) => {
      const die = state.G.gigDice[dieId as string];
      return die && die.dieType !== "d20";
    });
    const dieToTake = nonD20 ?? player.fixerArea[0]!;
    operations.gig.takeFromFixer(playerId, dieToTake, (dieType) => rollDie(dieType, rng));
  }
}

export function checkWinConditions(
  state: MatchState,
  playerId: PlayerId,
): { winner: PlayerId; reason: string } | null {
  const player = state.G.players[playerId as string];
  if (!player) return null;

  if (player.gigArea.length >= 7) {
    return { winner: playerId, reason: "gig_victory" };
  }

  if (player.zones.deck.length === 0) {
    const opponentId = state.ctx.playerIds.find((id) => id !== playerId);
    if (opponentId) {
      return { winner: opponentId, reason: "deck_out_victory" };
    }
  }

  return null;
}
