import type { PlayerConnectionBySide, Side } from "../../engine";
import { connectionUiStatus } from "../../engine/live/playerConnectionState";

export function rivalTimeoutExpired({
  humanSide,
  rivalSide,
  playerConnections,
  onClaimRivalDrop,
  gameEnded,
  rivalSeconds,
}: {
  humanSide: Side;
  rivalSide: Side;
  playerConnections?: PlayerConnectionBySide;
  onClaimRivalDrop?: () => void;
  gameEnded: boolean;
  rivalSeconds: number;
}): boolean {
  return Boolean(
    onClaimRivalDrop &&
    !gameEnded &&
    connectionUiStatus(playerConnections?.[humanSide]) === "connected" &&
    connectionUiStatus(playerConnections?.[rivalSide]) === "connected" &&
    rivalSeconds <= 0,
  );
}
