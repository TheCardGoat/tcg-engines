/**
 * Clock View - Shared consolidated clock data model
 *
 * Single source of truth for how clock data flows from the authoritative engine
 * state to any UI that displays it. Two types and two pure functions:
 *
 * - ClockSnapshot: the wire/contract shape. Emitted by projectTimerView, consumed
 *   by UIs unchanged. Field names match the engine's ctx.time per-player state.
 * - ClockView: fully computed UI data. Output of deriveClockView(snapshot, now).
 *   Everything a presenter needs to render — nothing it shouldn't.
 *
 * Why this file exists in the engine package (no Svelte deps):
 * - Clock semantics (urgency thresholds, skip/drop affordances) are part of the
 *   engine's domain, not UI decoration.
 * - Reusable from API handlers, tests, and future consumers without pulling in
 *   a UI framework.
 * - Testable in pure TS with no runtime.
 */

/**
 * Wire/contract shape for a single player's clock state.
 *
 * One shape from engine projection → derived state → presenter props. Field
 * names match the engine's per-player clock state so no rename dance is needed
 * anywhere along the path.
 *
 * `isRunning` is the flattened `ctx.time.running && activePlayerID === player`
 * — true only for the player whose segment is currently ticking.
 *
 * `timeoutCount` and `isInNegativeTime` are non-optional (default 0 / false) so
 * downstream consumers don't need to guard on `undefined`.
 *
 * `activePlayerAccumulatedMs` and `maxDecisionTimeMs` are only set when the
 * clock mode supports per-decision caps AND this player is the active one.
 */
export interface ClockSnapshot {
  reserveMsRemaining: number;
  isRunning: boolean;
  startedAtMs?: number;
  timeoutCount: number;
  isInNegativeTime: boolean;
  activePlayerAccumulatedMs?: number;
  maxDecisionTimeMs?: number;
}

/**
 * Fully computed UI data derived from a ClockSnapshot + current timestamp.
 *
 * Everything a presenter needs: interpolated remaining time, formatted string,
 * urgency class, low-time-tick gate, and the skip/drop affordances for the
 * timed-out opponent overlay.
 */
export interface ClockView {
  /** Signed reserve after client-side interpolation. Negative in negative time. */
  displayMs: number;
  isNegative: boolean;
  /** mm:ss with optional leading minus ("1:23" or "-0:05"). */
  formattedTime: string;
  urgencyClass: "" | "timer--warning" | "timer--danger" | "timer--critical";
  /** True when the owning player's clock is in the final 10s of positive reserve. */
  shouldPlayLowTimeTick: boolean;
  /** True when the per-decision cap has been exceeded in this priority window. */
  decisionCapExceeded: boolean;
  /**
   * True iff this player holds priority AND has either run out of reserve or
   * exceeded their per-decision cap. Drives the opponent skip overlay.
   */
  timedOutWithPriority: boolean;
  /**
   * Skip is available when the opponent is stalling (decision cap exceeded) but
   * their reserve is not yet exhausted. Not shown when reserve is negative —
   * use Drop instead.
   */
  canSkipOpponent: boolean;
  /**
   * Drop is available when:
   * - opponent's reserve is exhausted (isNegativeTime or displayMs < 0), OR
   * - opponent is stalling (decision cap exceeded, reserve still positive) AND
   *   has already been warned once (timeoutCount >= 1).
   */
  canDropOpponent: boolean;
  timeoutCount: number;
  isRunning: boolean;
}

export interface DeriveClockViewOptions {
  /** Enables the low-time tick sound gate. Only meaningful for the local player's clock. */
  isOwnClock?: boolean;
}

const WARNING_THRESHOLD_MS = 30_000;
const DANGER_THRESHOLD_MS = 10_000;
const LOW_TIME_TICK_WINDOW_MS = 10_000;

/**
 * Format a signed millisecond amount as "m:ss" with an optional leading minus.
 *
 * Examples:
 *   0        -> "0:00"
 *   59_999   -> "0:59"
 *   60_000   -> "1:00"
 *   -15_000  -> "-0:15"
 */
export function formatClockTime(ms: number): string {
  const isNegative = ms < 0;
  const absMs = Math.abs(ms);
  const minutes = Math.floor(absMs / 60_000);
  const seconds = Math.floor((absMs % 60_000) / 1000);
  return `${isNegative ? "-" : ""}${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Derive the full UI view for a single player's clock from their snapshot.
 *
 * Interpolation: when the clock is running, `displayMs = reserveMsRemaining -
 * (now - startedAtMs)`. When paused (or when the clock mode is "none"), the
 * snapshot's reserve is returned as-is.
 *
 * Never calls `Date.now()` internally — the caller must supply `now` so drift
 * between display and affordance logic is impossible.
 */
export function deriveClockView(
  snapshot: ClockSnapshot,
  now: number,
  opts: DeriveClockViewOptions = {},
): ClockView {
  const { isOwnClock = false } = opts;

  const running = snapshot.isRunning && typeof snapshot.startedAtMs === "number";
  const elapsed = running ? now - (snapshot.startedAtMs ?? 0) : 0;
  const displayMs = snapshot.reserveMsRemaining - elapsed;
  const isNegative = snapshot.isInNegativeTime || displayMs < 0;

  let decisionCapExceeded = false;
  if (running && snapshot.maxDecisionTimeMs != null) {
    const totalDecisionMs = (snapshot.activePlayerAccumulatedMs ?? 0) + elapsed;
    decisionCapExceeded = totalDecisionMs > snapshot.maxDecisionTimeMs;
  }

  const timedOutWithPriority = running && (isNegative || decisionCapExceeded);

  // Reserve exhausted → drop immediately (no prior warning needed), regardless
  // of whether the opponent currently holds priority.
  // Stalling (decision cap, reserve still positive) → drop on second offense.
  const canDropOpponent =
    isNegative || (running && decisionCapExceeded && !isNegative && snapshot.timeoutCount >= 1);

  // Skip is only for the stalling case: decision cap exceeded but reserve not
  // yet gone. When reserve is negative the only option is Drop.
  const canSkipOpponent = running && decisionCapExceeded && !isNegative;

  let urgencyClass: ClockView["urgencyClass"] = "";
  if (isNegative) {
    urgencyClass = "timer--critical";
  } else if (displayMs < DANGER_THRESHOLD_MS) {
    urgencyClass = "timer--danger";
  } else if (displayMs < WARNING_THRESHOLD_MS) {
    urgencyClass = "timer--warning";
  }

  const shouldPlayLowTimeTick =
    isOwnClock && snapshot.isRunning && displayMs > 0 && displayMs < LOW_TIME_TICK_WINDOW_MS;

  return {
    displayMs,
    isNegative,
    formattedTime: formatClockTime(displayMs),
    urgencyClass,
    shouldPlayLowTimeTick,
    decisionCapExceeded,
    timedOutWithPriority,
    canSkipOpponent,
    canDropOpponent,
    timeoutCount: snapshot.timeoutCount,
    isRunning: snapshot.isRunning,
  };
}
