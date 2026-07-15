export interface SemanticCycleDetector {
  observe(fingerprint: string): { repeated: boolean; count: number };
  reset(): void;
}

export interface SemanticCycleDetectorOptions {
  readonly repeatThreshold?: number;
  readonly windowSize?: number;
}

export function createSemanticCycleDetector(
  options: SemanticCycleDetectorOptions = {},
): SemanticCycleDetector {
  const repeatThreshold = options.repeatThreshold ?? 3;
  const windowSize = Math.max(repeatThreshold, options.windowSize ?? 24);
  const window: string[] = [];
  const counts = new Map<string, number>();

  return {
    observe(fingerprint) {
      window.push(fingerprint);
      const count = (counts.get(fingerprint) ?? 0) + 1;
      counts.set(fingerprint, count);

      if (window.length > windowSize) {
        const removed = window.shift();
        if (removed) {
          const remaining = (counts.get(removed) ?? 1) - 1;
          if (remaining === 0) counts.delete(removed);
          else counts.set(removed, remaining);
        }
      }

      const windowCount = counts.get(fingerprint) ?? 0;
      return { repeated: windowCount >= repeatThreshold, count: windowCount };
    },
    reset() {
      window.length = 0;
      counts.clear();
    },
  };
}
