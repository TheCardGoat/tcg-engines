/**
 * Move Registry Cache
 *
 * Provides a stateID-keyed singleton registry for use in move execution.
 * The registry is built at most once per state ID and cached across all
 * restriction/stat calls within the same game action.
 *
 * Usage:
 *   const registry = getOrBuildMoveRegistry(ctx);
 *   // Pass registry to hasStaticCardRestriction / hasStaticPlayerRestriction / etc.
 */

import type { CardInstanceId, DeepReadonly, FrameworkStateSnapshot } from "#core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import type { StaticEffectRegistry } from "../../rules/static-effect-registry";
import type { DerivedStateContext } from "../../rules/derived-state";
import { buildStaticEffectRegistry } from "../../rules/static-effect-registry";
import { createProjectionState } from "../../rules/derived-state";
import {
  createStateScopedValueCache,
  getOrBuildStateScopedValue,
  getStateScopedValueCacheStats,
  type CacheObserver,
  type StateScopedValueCacheStats,
} from "../../core/runtime/state-scoped-value-cache";
import type { LorcanaMatchState } from "../../types";

/**
 * Minimum context shape needed to build a registry in move execution.
 * G is typed as DerivedStateContext["G"] to accept both mutable LorcanaG
 * and the DeepReadonly variants produced by move/validation/enumeration contexts.
 */
export type MoveRegistryCtx = {
  framework: { state: FrameworkStateSnapshot };
  G: DerivedStateContext["G"];
  cards: { getDefinition: (id: CardInstanceId) => LorcanaCardDefinition | undefined };
};

const moveRegistryCache = createStateScopedValueCache<StaticEffectRegistry>({
  label: "move-registry",
});

/**
 * Returns the static effect registry for the current state, building it once
 * and serving subsequent calls from the cache until static-ability-relevant
 * state changes.
 *
 * Cache key is G.staticEffectsVersion (incremented only when static ability
 * inputs change: cards entering/leaving play, keyword/ability grants, continuous
 * effects, meta state changes). Commands that don't affect static abilities
 * (draw, gain lore, shuffle) reuse the cached registry across stateID changes.
 */
export function getOrBuildMoveRegistry(ctx: MoveRegistryCtx): StaticEffectRegistry {
  const getDefinition = (id: CardInstanceId) => ctx.cards.getDefinition(id);
  const stateID = ctx.framework.state.stateID;
  // Low-level mock contexts (e.g. createTestContext in unit tests) do not provide a stateID.
  // Without a valid numeric stateID we cannot safely key into the cache, so always build fresh.
  if (typeof stateID !== "number" || !Number.isFinite(stateID)) {
    return buildStaticEffectRegistry(
      createProjectionState(ctx.framework.state, ctx.G),
      getDefinition,
    );
  }
  // Use staticEffectsVersion as the cache version if available, falling back to stateID.
  // staticEffectsVersion only increments when static-ability-relevant state changes,
  // so the registry can be reused across commands that don't affect static abilities.
  const staticEffectsVersion = ctx.G?.staticEffectsVersion;
  const cacheVersion =
    typeof staticEffectsVersion === "number" && Number.isFinite(staticEffectsVersion)
      ? staticEffectsVersion
      : stateID;
  // Use matchID as the actor key so that different game instances (including test engines
  // that all start at stateID=0) do not share cached registries.
  const matchID = ctx.framework.state.matchID ?? "__system__";
  return getOrBuildStateScopedValue({
    cache: moveRegistryCache,
    stateID: cacheVersion,
    actorKey: matchID,
    cardId: "__registry__",
    build: () =>
      buildStaticEffectRegistry(createProjectionState(ctx.framework.state, ctx.G), getDefinition),
  });
}

/**
 * Builds a fresh static effect registry from a raw match state (for non-move contexts
 * such as lorcana-engine-base.ts or automation/planner.ts that have access to the full
 * authoritative state but not a FrameworkStateSnapshot).
 */
export function buildRegistryFromMatchState(
  matchState: DeepReadonly<LorcanaMatchState>,
  getDefinitionByInstanceId: (id: CardInstanceId) => LorcanaCardDefinition | undefined,
): StaticEffectRegistry {
  return buildStaticEffectRegistry(matchState, getDefinitionByInstanceId);
}

/**
 * Replace the observer attached to the module-level move-registry cache.
 *
 * Today this is the only seam available because the cache is a module
 * singleton. Once Section 5 lands and `RegistryProvider` becomes
 * per-`MatchRuntime`, observers will be passed at construction time.
 */
export function setMoveRegistryCacheObserver(observer: CacheObserver): void {
  moveRegistryCache.observer = observer;
}

/**
 * Snapshot of the module-level move-registry cache's stats. Exposed via
 * `RegistryProvider.stats()` for telemetry. Returns the live counters for the
 * current `stateID` window — they reset on evict.
 */
export function getMoveRegistryCacheStats(): StateScopedValueCacheStats {
  return getStateScopedValueCacheStats(moveRegistryCache);
}
