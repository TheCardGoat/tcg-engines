import type { ClockSnapshot } from "@tcg/lorcana-engine";

/** Translate server epoch time into the local monotonic clock's coordinate system. */
export function anchorClockSnapshot(
  snapshot: ClockSnapshot | undefined,
  serverTimestamp: number,
  receivedAtMs: number,
): ClockSnapshot | undefined {
  if (!snapshot || snapshot.startedAtMs === undefined) return snapshot;

  return {
    ...snapshot,
    startedAtMs: receivedAtMs - (serverTimestamp - snapshot.startedAtMs),
  };
}
