export interface ClockSnapshot {
  reserveMsRemaining: number;
  isRunning: boolean;
  startedAtMs?: number;
  timeoutCount: number;
  isInNegativeTime: boolean;
  activePlayerAccumulatedMs?: number;
  maxDecisionTimeMs?: number;
}

export interface ClockView {
  displayMs: number;
  isNegative: boolean;
  formattedTime: string;
  urgencyClass: "" | "timer--warning" | "timer--danger" | "timer--critical";
  shouldPlayLowTimeTick: boolean;
  decisionCapExceeded: boolean;
  timedOutWithPriority: boolean;
  canSkipOpponent: boolean;
  canDropOpponent: boolean;
  timeoutCount: number;
  isRunning: boolean;
}

export interface DeriveClockViewOptions {
  isOwnClock?: boolean;
}

const WARNING_THRESHOLD_MS = 30_000;
const DANGER_THRESHOLD_MS = 10_000;
const LOW_TIME_TICK_WINDOW_MS = 10_000;

export function formatClockTime(ms: number): string {
  const isNegative = ms < 0;
  const absMs = Math.abs(ms);
  const minutes = Math.floor(absMs / 60_000);
  const seconds = Math.floor((absMs % 60_000) / 1000);
  return `${isNegative ? "-" : ""}${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function deriveClockView(
  snapshot: ClockSnapshot,
  now: number,
  opts: DeriveClockViewOptions = {},
): ClockView {
  const { isOwnClock = false } = opts;

  const running = snapshot.isRunning && typeof snapshot.startedAtMs === "number";
  const elapsed = running ? Math.max(0, now - (snapshot.startedAtMs ?? 0)) : 0;
  const displayMs = snapshot.reserveMsRemaining - elapsed;
  const isNegative = snapshot.isInNegativeTime || displayMs < 0;

  let decisionCapExceeded = false;
  if (running && snapshot.maxDecisionTimeMs != null) {
    const totalDecisionMs = (snapshot.activePlayerAccumulatedMs ?? 0) + elapsed;
    decisionCapExceeded = totalDecisionMs > snapshot.maxDecisionTimeMs;
  }

  const timedOutWithPriority = running && (isNegative || decisionCapExceeded);
  const canDropOpponent =
    isNegative || (running && decisionCapExceeded && !isNegative && snapshot.timeoutCount >= 1);
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
    isOwnClock && running && displayMs > 0 && displayMs < LOW_TIME_TICK_WINDOW_MS;

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
    isRunning: running,
  };
}
