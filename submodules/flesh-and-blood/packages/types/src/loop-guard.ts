/**
 * Shared infinite-loop prevention for `while` loops across the Flesh and Blood
 * workspace (engine, catalog ingest, scraper, and their tests).
 *
 * This lives in `@tcg/flesh-and-blood-types` because it is the one package every
 * other workspace depends on, so a single guard implementation is available to
 * all of them without introducing a rules-engine dependency into the tooling
 * packages (catalog, scraper).
 *
 * A guarded loop calls `guard.tick()` at the top of each iteration. When the
 * iteration budget is exhausted the guard throws `FabLoopLimitError` instead of
 * letting the loop spin forever. The budget is deliberately a coarse safety net
 * (default `DEFAULT_FAB_LOOP_LIMIT`), not a semantic limit: a loop with a
 * legitimately larger bound may pass a higher `limit`.
 */

/** Default iteration budget for a guarded loop. */
export const DEFAULT_FAB_LOOP_LIMIT = 1_000;

export interface FabLoopGuardOptions {
  /** Human-readable identity of the loop, surfaced in the error message. */
  readonly label: string;
  /** Maximum iterations before the guard throws. Defaults to `DEFAULT_FAB_LOOP_LIMIT`. */
  readonly limit?: number;
}

export interface FabLoopGuard {
  /** Advance one iteration and enforce the budget. Throws when exhausted. */
  readonly tick: () => void;
  /** Iterations consumed so far. */
  readonly count: number;
  readonly label: string;
  readonly limit: number;
}

/** Raised when a guarded loop exceeds its iteration budget instead of spinning forever. */
export class FabLoopLimitError extends Error {
  readonly label: string;
  readonly limit: number;
  readonly count: number;

  constructor(label: string, limit: number, count: number) {
    super(`FAB loop iteration limit exceeded (${label}): ${count} iterations > ${limit}.`);
    this.name = "FabLoopLimitError";
    this.label = label;
    this.limit = limit;
    this.count = count;
  }
}

/** Create an iteration guard for a single `while` loop. */
export function createFabLoopGuard(options: FabLoopGuardOptions): FabLoopGuard {
  const { label } = options;
  const limit = options.limit ?? DEFAULT_FAB_LOOP_LIMIT;
  let count = 0;
  return {
    get count(): number {
      return count;
    },
    get label(): string {
      return label;
    },
    get limit(): number {
      return limit;
    },
    tick(): void {
      count += 1;
      if (count > limit) {
        throw new FabLoopLimitError(label, limit, count);
      }
    },
  };
}
