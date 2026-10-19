import type { AcSeat, AlphaClashResult } from "./components/board-types";

/** Complete phases must carry the native winner and end reason together. */
export function parseAlphaClashResult(phase: Record<string, unknown>): AlphaClashResult | null {
  if (phase.name !== "complete") return null;
  if (phase.winner !== "player-one" && phase.winner !== "player-two") return null;
  switch (phase.reason) {
    case "contenderDefeated":
    case "decked":
    case "concede":
    case "cardEffect":
      return { winner: phase.winner, reason: phase.reason };
    default:
      return null;
  }
}

export function alphaClashResultCopy(
  result: AlphaClashResult | undefined,
  viewer: AcSeat,
  hotSeat = false,
) {
  if (!result)
    return {
      outcome: "draw" as const,
      title: "Game complete",
      reason: "Waiting for the final result.",
    };
  const won = result.winner === viewer;
  const winner = result.winner === "player-one" ? "Player 1" : "Player 2";
  const loser = result.winner === "player-one" ? "Player 2" : "Player 1";
  const reasons = {
    contenderDefeated: hotSeat
      ? `${loser}'s Contender was defeated`
      : won
        ? "Opponent's Contender was defeated"
        : "Your Contender was defeated",
    decked: hotSeat
      ? `${loser} could not draw a card`
      : won
        ? "Opponent could not draw a card"
        : "You could not draw a card",
    concede: hotSeat ? `${loser} conceded` : won ? "Opponent conceded" : "You conceded",
    cardEffect: "Game ended by a card effect",
  };
  return {
    outcome: hotSeat ? ("draw" as const) : won ? ("win" as const) : ("loss" as const),
    title: hotSeat ? `${winner} wins` : won ? "Victory" : "Defeat",
    reason: reasons[result.reason],
  };
}
