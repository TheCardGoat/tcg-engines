import type { StateScopedValueCacheStats } from "../../core/runtime/state-scoped-value-cache";
import type { StaticEffectRegistry } from "../../rules/static-effect-registry";
import {
  getMoveRegistryCacheStats,
  getOrBuildMoveRegistry,
  type MoveRegistryCtx,
} from "./move-registry-cache";
import { buildStaticEffectRegistry } from "../../rules/static-effect-registry";
import { createProjectionState } from "../../rules/derived-state";

/**
 * Cleaner interface over the static-effect registry cache. Expose the four
 * operations callers actually need:
 *
 *   - `getOrBuild`: cache-aware lookup; primary call shape for move execution.
 *   - `buildFresh`: bypass the cache and rebuild from current state. Useful
 *     for projection paths (`runtime-game/project-board.ts`) where running
 *     outside a move means the cache key may not be set up yet.
 *   - `warmFor`: pre-populate the cache for the current state. Called once
 *     after `_stateID++` so the next consumer gets a hot cache and the build
 *     cost is paid inside the move's tracing span instead of as a latency
 *     surprise on the next read.
 *   - `stats`: observability snapshot of hits/misses/buildTimeMs.
 *
 * The provider is module-singleton-backed today — it wraps the existing
 * `move-registry-cache.ts` module-level cache, so all callers share one
 * instance. Cross-game leak is avoided because the cache key already includes
 * `matchID`. To install a custom observer, call
 * {@link setMoveRegistryCacheObserver} directly — it's a global mutation by
 * design (the cache is a singleton), and an explicit setter is clearer than
 * a "factory" that mutates global state on every call.
 */
export interface RegistryProvider {
  getOrBuild(ctx: MoveRegistryCtx): StaticEffectRegistry;
  buildFresh(ctx: MoveRegistryCtx): StaticEffectRegistry;
  warmFor(ctx: MoveRegistryCtx): void;
  stats(): StateScopedValueCacheStats;
}

function createRegistryProvider(): RegistryProvider {
  return {
    getOrBuild(ctx) {
      return getOrBuildMoveRegistry(ctx);
    },
    buildFresh(ctx) {
      // Bypass the cache by rebuilding directly. Mirrors the path used today
      // by the projection callers in `runtime-game/project-board.ts`.
      return buildStaticEffectRegistry(createProjectionState(ctx.framework.state, ctx.G), (id) =>
        ctx.cards.getDefinition(id),
      );
    },
    warmFor(ctx) {
      // Build via the cached path so the underlying singleton is populated.
      // The result is intentionally discarded — the next consumer hits warm.
      //
      // Callers MUST invoke this with a ctx whose `framework.state.stateID`
      // and `G.staticEffectsVersion` reflect the *post-mutation* values, since
      // those are the cache keys. `match-runtime.commands.ts` constructs a
      // fresh framework snapshot via `createFrameworkStateSnapshot(draft, …)`
      // after `_stateID++` to satisfy this contract.
      void getOrBuildMoveRegistry(ctx);
    },
    stats() {
      return getMoveRegistryCacheStats();
    },
  };
}

/**
 * Singleton handle to the shared move-registry cache. Call `setMoveRegistryCacheObserver`
 * (re-exported below for convenience) to install an observer for telemetry —
 * the observer is global by construction.
 */
export const defaultRegistryProvider: RegistryProvider = createRegistryProvider();

export { setMoveRegistryCacheObserver } from "./move-registry-cache";
