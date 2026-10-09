import type { MatchState } from "../types/match-state.ts";

/** CR 1.11.1 checks both public Fixer areas at the start of each turn. */
export function bothFixerAreasEmpty(state: MatchState): boolean {
  return state.ctx.playerIds.every((id) => state.G.players[id as string]?.fixerArea.length === 0);
}

/** Earliest turn-end at which overtime can begin if no effect moves dice into a Fixer area. */
export function turnsUntilOvertime(state: MatchState): number {
  if (state.G.overtime) return 0;

  const players = state.ctx.playerIds;
  const remaining = players.map((id) => state.G.players[id as string]?.fixerArea.length ?? 0);
  let activeIndex = players.findIndex((id) => id === state.G.turnMetadata.activePlayerId);
  let consecutive = state.G.turnMetadata.previousTurnBeganWithEmptyFixer ? 1 : 0;
  let currentTurnQualifies = state.G.turnMetadata.turnBeganWithEmptyFixer;

  if (state.G.gamePhase === "start" && !state.G.turnMetadata.gigTakenThisTurn) {
    const currentPlayerDice = remaining[activeIndex] ?? 0;
    if (currentPlayerDice > 0) remaining[activeIndex] = currentPlayerDice - 1;
  }

  const maxTurns = 2 * (remaining.reduce((sum, count) => sum + count, 0) + 2);
  for (let turns = 1; turns <= maxTurns; turns++) {
    consecutive = currentTurnQualifies ? consecutive + 1 : 0;
    if (consecutive >= 2) return turns;
    activeIndex = (activeIndex + 1) % players.length;
    currentTurnQualifies = remaining.every((count) => count === 0);
    const nextPlayerDice = remaining[activeIndex] ?? 0;
    if (nextPlayerDice > 0) remaining[activeIndex] = nextPlayerDice - 1;
  }

  throw new Error("Overtime countdown could not reach two empty-Fixer turns");
}
