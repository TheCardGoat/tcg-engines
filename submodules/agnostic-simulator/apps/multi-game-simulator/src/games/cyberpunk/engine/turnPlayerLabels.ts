import type { MatchState } from "@tcg/cyberpunk-engine";

import { PLAYER_SIDE_TO_ID, type PlayerIdentityBySide, type Side } from "./sides";
import type { MoveLogEntry } from "./EngineProvider";

/** Match turn numbers alternate between the first player and their rival. */
export function cyberpunkTurnPlayerLabels(
  matchState: MatchState,
  moveLogs: readonly MoveLogEntry[],
  playerIdentities: PlayerIdentityBySide | undefined,
  humanSide: Side,
): (turn: number) => string | undefined {
  const startedByTurn = new Map<number, string>();
  for (const { log } of moveLogs) {
    if (log.type === "turnStarted") startedByTurn.set(log.turnNumber, String(log.playerId));
  }

  const firstSide: Side = matchState.G.players[PLAYER_SIDE_TO_ID.player]?.firstPlayer
    ? "player"
    : "opponent";

  return (turn) => {
    if (turn < 1) return undefined;
    const recordedPlayerId = startedByTurn.get(turn);
    const side: Side =
      recordedPlayerId === PLAYER_SIDE_TO_ID.player
        ? "player"
        : recordedPlayerId === PLAYER_SIDE_TO_ID.opponent
          ? "opponent"
          : turn % 2 === 1
            ? firstSide
            : firstSide === "player"
              ? "opponent"
              : "player";
    return playerIdentities?.[side]?.displayName ?? (side === humanSide ? "You" : "Rival");
  };
}
