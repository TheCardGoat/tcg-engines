export interface FabTestInitializationSample {
  readonly operation: string;
  readonly durationMs: number;
}

let initializationObserver: ((sample: FabTestInitializationSample) => void) | null = null;

/**
 * Local-only instrumentation for the real-match test bootstrap.
 *
 * The harness deliberately uses production initialization. This observer lets
 * benchmarks identify its expensive stages without changing normal test or
 * runtime behaviour.
 */
export function observeFabTestInitialization(
  observer: ((sample: FabTestInitializationSample) => void) | null,
): void {
  initializationObserver = observer;
}

export function profileFabTestInitialization<Value>(operation: string, run: () => Value): Value {
  if (!initializationObserver) return run();
  const startedAt = performance.now();
  try {
    return run();
  } finally {
    initializationObserver({ operation, durationMs: performance.now() - startedAt });
  }
}
