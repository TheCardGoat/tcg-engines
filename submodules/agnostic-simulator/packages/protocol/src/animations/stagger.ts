export const DEFAULT_CONSECUTIVE_STAGGER_MS = 65;

/**
 * Return a stable delay for the current item within its consecutive key run.
 * A null key breaks the run so unrelated animation feedback remains parallel.
 */
export function consecutiveAnimationStaggerMs<T>(
  items: readonly T[],
  index: number,
  keyOf: (item: T) => string | null,
  intervalMs = DEFAULT_CONSECUTIVE_STAGGER_MS,
): number {
  const current = items[index];
  if (current === undefined) return 0;
  const key = keyOf(current);
  if (key === null) return 0;

  let adjacentMatches = 0;
  for (let priorIndex = index - 1; priorIndex >= 0; priorIndex -= 1) {
    const prior = items[priorIndex];
    if (prior === undefined || keyOf(prior) !== key) break;
    adjacentMatches += 1;
  }

  return adjacentMatches * intervalMs;
}
