/**
 * Per-event observer for cache lifecycle. All callbacks are optional. Hosts
 * (e.g. `apps/api`) can supply an observer to wire telemetry; the engine
 * package keeps zero observability dependencies of its own.
 *
 * Cadence: `onHit`/`onMiss` fire on every lookup. `onEvict` fires when the
 * cache transitions to a new `stateID` (the previous bucket is cleared) or
 * when `clearStateScopedValueCache` is called.
 */
export interface CacheObserver {
  onHit?(label: string, key: string, stateID: number): void;
  onMiss?(label: string, key: string, stateID: number, buildMs: number): void;
  onEvict?(
    label: string,
    fromStateID: number | null,
    toStateID: number | null,
    statsSnapshot: StateScopedValueCacheStats,
  ): void;
}

export interface StateScopedValueCacheStats {
  stateID: number | null;
  hits: number;
  misses: number;
  buildTimeMs: number;
}

export interface StateScopedValueCache<TValue> {
  currentStateID: number | null;
  actorBuckets: Map<string, Map<string, TValue>>;
  stats: StateScopedValueCacheStats;
  /** Stable identifier used by the observer (e.g. "move-registry"). */
  label: string;
  /** Active observer; defaults to {@link DEFAULT_DEBUG_OBSERVER}. */
  observer: CacheObserver;
}

export interface CreateStateScopedValueCacheOptions {
  /**
   * Stable label passed to observer callbacks. Defaults to "state-scoped-cache"
   * which is fine for one-off uses, but every long-lived cache should set a
   * descriptive label so telemetry is greppable.
   */
  label?: string;
  /**
   * Custom observer. When omitted, the cache uses {@link DEFAULT_DEBUG_OBSERVER}
   * which preserves the historical `__TCG_DEBUG_PERFORMANCE__`-gated summary log
   * on every evict. Pass an explicit observer to opt in to per-event telemetry.
   */
  observer?: CacheObserver;
}

const DEFAULT_ACTOR_KEY = "__system__";
const DEFAULT_LABEL = "state-scoped-cache";
const DEBUG_PERF_FLAG = "__TCG_DEBUG_PERFORMANCE__";

function nowMs(): number {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

function debugPerfEnabled(): boolean {
  return (globalThis as Record<string, unknown>)[DEBUG_PERF_FLAG] === true;
}

/**
 * Built-in observer that mirrors the historical debug-flag-gated summary log:
 * fires once per evict (the prior `stateID`'s aggregate hits/misses/buildTimeMs).
 * Per-hit/per-miss callbacks are intentionally absent — the engine's
 * `__TCG_DEBUG_PERFORMANCE__` flag is meant for coarse-grained perf surveys,
 * not request-level tracing.
 */
export const DEFAULT_DEBUG_OBSERVER: CacheObserver = {
  onEvict(label, fromStateID, _toStateID, statsSnapshot) {
    if (!debugPerfEnabled() || fromStateID === null) {
      return;
    }
    if (statsSnapshot.hits === 0 && statsSnapshot.misses === 0) {
      return;
    }
    console.info(`[engine][perf] ${label}`, {
      stateID: statsSnapshot.stateID,
      hits: statsSnapshot.hits,
      misses: statsSnapshot.misses,
      buildTimeMs: Number(statsSnapshot.buildTimeMs.toFixed(2)),
    });
  },
};

function snapshotStats(stats: StateScopedValueCacheStats): StateScopedValueCacheStats {
  return {
    stateID: stats.stateID,
    hits: stats.hits,
    misses: stats.misses,
    buildTimeMs: stats.buildTimeMs,
  };
}

export function createStateScopedValueCache<TValue>(
  options: CreateStateScopedValueCacheOptions = {},
): StateScopedValueCache<TValue> {
  return {
    currentStateID: null,
    actorBuckets: new Map(),
    stats: {
      stateID: null,
      hits: 0,
      misses: 0,
      buildTimeMs: 0,
    },
    label: options.label ?? DEFAULT_LABEL,
    observer: options.observer ?? DEFAULT_DEBUG_OBSERVER,
  };
}

export function clearStateScopedValueCache(cache: StateScopedValueCache<unknown>): void {
  cache.observer.onEvict?.(cache.label, cache.currentStateID, null, snapshotStats(cache.stats));
  cache.currentStateID = null;
  cache.actorBuckets.clear();
  cache.stats = {
    stateID: null,
    hits: 0,
    misses: 0,
    buildTimeMs: 0,
  };
}

export function getStateScopedValueCacheStats(
  cache: StateScopedValueCache<unknown>,
): StateScopedValueCacheStats {
  return snapshotStats(cache.stats);
}

export function getOrBuildStateScopedValue<TValue>(args: {
  cache: StateScopedValueCache<TValue>;
  stateID: number;
  actorKey?: string;
  cardId: string;
  build: () => TValue;
}): TValue {
  const { cache, stateID, cardId, build } = args;
  const actorKey = args.actorKey ?? DEFAULT_ACTOR_KEY;

  if (cache.currentStateID !== stateID) {
    cache.observer.onEvict?.(
      cache.label,
      cache.currentStateID,
      stateID,
      snapshotStats(cache.stats),
    );
    cache.currentStateID = stateID;
    cache.actorBuckets.clear();
    cache.stats = {
      stateID,
      hits: 0,
      misses: 0,
      buildTimeMs: 0,
    };
  }

  let actorBucket = cache.actorBuckets.get(actorKey);
  if (!actorBucket) {
    actorBucket = new Map<string, TValue>();
    cache.actorBuckets.set(actorKey, actorBucket);
  }

  const cached = actorBucket.get(cardId);
  if (cached !== undefined) {
    cache.stats.hits += 1;
    cache.observer.onHit?.(cache.label, cardId, stateID);
    return cached;
  }

  const startedAt = nowMs();
  const value = build();
  const buildMs = nowMs() - startedAt;
  cache.stats.misses += 1;
  cache.stats.buildTimeMs += buildMs;
  actorBucket.set(cardId, value);
  cache.observer.onMiss?.(cache.label, cardId, stateID, buildMs);
  return value;
}
