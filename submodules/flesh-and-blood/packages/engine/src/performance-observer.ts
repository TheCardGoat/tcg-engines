export interface FabPerformanceSample {
  readonly operation: string;
  readonly durationMs: number;
}

let performanceObserver: ((sample: FabPerformanceSample) => void) | null = null;

/** Local profiling hook. Production dispatch does not install an observer. */
export function observeFabPerformance(
  observer: ((sample: FabPerformanceSample) => void) | null,
): void {
  performanceObserver = observer;
}

export function profileFabOperation<Value>(operation: string, run: () => Value): Value {
  if (!performanceObserver) return run();
  const startedAt = performance.now();
  try {
    return run();
  } finally {
    performanceObserver({ operation, durationMs: performance.now() - startedAt });
  }
}
