import { useEffect, useMemo, useState } from "react";
import type { PlayerConnectionInfo } from "../sides";
import { connectionUiStatus } from "./playerConnectionState";

const DROP_THRESHOLD_SECONDS = 30;

export interface OpponentPresence {
  /** Whether the opponent is currently connected. */
  opponentConnected: boolean;
  /** Seconds remaining before a drop is allowed (30 -> 0). */
  secondsRemaining: number;
  /** True when the opponent has been disconnected for >= 30 s. */
  canDrop: boolean;
}

/**
 * Tracks opponent connection status and manages the 30-second disconnect
 * countdown before allowing a drop.
 *
 * Uses server-authoritative `disconnectedAt` timestamps so client and server
 * agree on when the threshold elapses.
 */
export function useOpponentPresence(
  connection: PlayerConnectionInfo | undefined,
): OpponentPresence {
  const status = connectionUiStatus(connection);
  const opponentConnected = status === "connected";
  const disconnectedAt = connection?.disconnectedAt;

  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    computeSecondsRemaining(disconnectedAt),
  );

  useEffect(() => {
    setSecondsRemaining(computeSecondsRemaining(disconnectedAt));

    if (opponentConnected || !disconnectedAt) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsRemaining(computeSecondsRemaining(disconnectedAt));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [opponentConnected, disconnectedAt]);

  const canDrop = !opponentConnected && secondsRemaining <= 0;

  return useMemo(
    () => ({
      opponentConnected,
      secondsRemaining,
      canDrop,
    }),
    [opponentConnected, secondsRemaining, canDrop],
  );
}

function computeSecondsRemaining(disconnectedAt: string | undefined): number {
  if (!disconnectedAt) {
    return DROP_THRESHOLD_SECONDS;
  }
  const elapsedSec = Math.floor((Date.now() - new Date(disconnectedAt).getTime()) / 1000);
  return Math.max(0, DROP_THRESHOLD_SECONDS - elapsedSec);
}
