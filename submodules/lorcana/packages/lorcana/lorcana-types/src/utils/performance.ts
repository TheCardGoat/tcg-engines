/**
 * High-resolution monotonic time in milliseconds.
 * Uses `performance.now` when available (browser, modern Node/Bun); otherwise `Date.now`.
 */
export function nowMs(): number {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

export type PerformanceMeasurement = Readonly<{
  label: string;
  durationMs: number;
}>;

export type PerformanceObserver = (measurement: PerformanceMeasurement) => void;

/**
 * Returns elapsed milliseconds since this stopwatch was created.
 * Call `stop()` once for a final `{ label, durationMs }` snapshot.
 */
export function createStopwatch(label: string): {
  elapsedMs: () => number;
  stop: () => PerformanceMeasurement;
} {
  const start = nowMs();
  return {
    elapsedMs: () => nowMs() - start,
    stop: () => {
      const durationMs = nowMs() - start;
      console.info(`[perf] ${label}`, { durationMs });
      return { label, durationMs };
    },
  };
}

/**
 * Times a synchronous function. `onComplete` runs in `finally`, so it fires even if `fn` throws.
 */
export function measureSync<T>(label: string, fn: () => T, onComplete?: PerformanceObserver): T {
  const start = nowMs();
  try {
    return fn();
  } finally {
    onComplete?.({ label, durationMs: nowMs() - start });
  }
}

/**
 * Times an async function. `onComplete` runs in `finally` after the promise settles.
 */
export async function measureAsync<T>(
  label: string,
  fn: () => Promise<T>,
  onComplete?: PerformanceObserver,
): Promise<T> {
  const start = nowMs();
  try {
    return await fn();
  } finally {
    onComplete?.({ label, durationMs: nowMs() - start });
  }
}
