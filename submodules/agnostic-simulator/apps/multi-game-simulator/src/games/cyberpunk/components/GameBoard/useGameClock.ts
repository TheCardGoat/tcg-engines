import { useEffect, useState } from "react";
import { PLAYER_SIDE_TO_ID, useEngine, type Side } from "../../engine";

/**
 * Shared priority clock. Each side owns a separate countdown, and only the
 * side currently holding priority ticks down. Each consumer creates an
 * independent ticker; only one component is mounted per layout variant.
 */
export function useGameClock(
  prioritySide: Side,
  { initialSeconds = 720, paused = false }: { initialSeconds?: number; paused?: boolean } = {},
) {
  const { matchState } = useEngine();
  const serverClock = readServerClockSeconds(matchState, prioritySide);
  const clockDisabled = matchState.ctx.timeControl?.mode === "none";
  const [secondsBySide, setSecondsBySide] = useState<Record<Side, number>>({
    player: initialSeconds,
    opponent: initialSeconds,
  });

  useEffect(() => {
    if (clockDisabled) {
      return undefined;
    }
    if (serverClock === null) {
      return undefined;
    }

    const update = () => {
      const now = Date.now();
      setSecondsBySide({
        player: secondsRemainingForSide(matchState, "player", now, initialSeconds),
        opponent: secondsRemainingForSide(matchState, "opponent", now, initialSeconds),
      });
    };
    update();
    if (paused) {
      return undefined;
    }

    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [clockDisabled, initialSeconds, matchState, paused, serverClock]);

  useEffect(() => {
    if (clockDisabled) {
      return undefined;
    }
    if (serverClock !== null) {
      return undefined;
    }
    if (paused) {
      return undefined;
    }

    const id = setInterval(
      () =>
        setSecondsBySide((current) => ({
          ...current,
          [prioritySide]: current[prioritySide] - 1,
        })),
      1000,
    );
    return () => clearInterval(id);
  }, [clockDisabled, paused, prioritySide, serverClock]);

  const activeSeconds = secondsBySide[prioritySide];
  const activeTime = clockDisabled ? "--:--" : formatClock(activeSeconds);
  const playerTime = clockDisabled ? "--:--" : formatClock(secondsBySide.player);
  const opponentTime = clockDisabled ? "--:--" : formatClock(secondsBySide.opponent);

  return {
    active: {
      seconds: clockDisabled ? Number.POSITIVE_INFINITY : activeSeconds,
      time: activeTime,
      urgent: !clockDisabled && activeSeconds <= 60,
      critical: !clockDisabled && activeSeconds <= 10,
    },
    player: {
      seconds: clockDisabled ? Number.POSITIVE_INFINITY : secondsBySide.player,
      time: playerTime,
      urgent: !clockDisabled && secondsBySide.player <= 60,
      critical: !clockDisabled && secondsBySide.player <= 10,
    },
    opponent: {
      seconds: clockDisabled ? Number.POSITIVE_INFINITY : secondsBySide.opponent,
      time: opponentTime,
      urgent: !clockDisabled && secondsBySide.opponent <= 60,
      critical: !clockDisabled && secondsBySide.opponent <= 10,
    },
  };
}

function formatClock(totalSeconds: number) {
  const sign = totalSeconds < 0 ? "-" : "";
  const absSeconds = Math.abs(totalSeconds);
  const m = Math.floor(absSeconds / 60);
  const s = absSeconds % 60;
  return `${sign}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function readServerClockSeconds(
  state: ReturnType<typeof useEngine>["matchState"],
  side: Side,
): number | null {
  const clock = state.ctx.clockState?.[String(PLAYER_SIDE_TO_ID[side])];
  if (!clock || typeof clock.reserveMsRemaining !== "number") {
    return null;
  }
  return Math.ceil(clock.reserveMsRemaining / 1000);
}

function secondsRemainingForSide(
  state: ReturnType<typeof useEngine>["matchState"],
  side: Side,
  now: number,
  fallbackSeconds: number,
): number {
  const clock = state.ctx.clockState?.[String(PLAYER_SIDE_TO_ID[side])];
  if (!clock || typeof clock.reserveMsRemaining !== "number") {
    return fallbackSeconds;
  }
  const elapsedMs =
    clock.isOnClock === true && typeof clock.lastUpdatedAtMs === "number"
      ? Math.max(0, now - clock.lastUpdatedAtMs)
      : 0;
  return Math.ceil((clock.reserveMsRemaining - elapsedMs) / 1000);
}
