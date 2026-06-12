/**
 * Centralized invalidator for the static-effect registry cache key.
 *
 * Static-ability evaluation is cached by `G.staticEffectsVersion`. Any mutation
 * that affects the inputs to that evaluation — cards entering/leaving play,
 * meta changes (state, damage, location, temporary effects), continuous-effect
 * registrations, challenge-state transitions, player-restriction churn, turn
 * transitions — must bump the version so the next read rebuilds the registry.
 *
 * This file is the **only** place in the engine that writes to
 * `G.staticEffectsVersion`. CI greps for `staticEffectsVersion\s*=` and fails
 * the build on any new direct write — every mutator routes through this
 * helper (or through a domain setter that calls it).
 *
 * Why a counter and not a content-derived key: bumping a counter is O(1) and
 * deterministic; deriving a key from registry inputs would require walking
 * card meta, continuous effects, and zones on every read. The counter is hot
 * enough that a content-derived key would only be considered if observability
 * shows it as a performance problem.
 */
export interface InvalidatableState {
  G?: { staticEffectsVersion?: number } | undefined;
}

export function invalidateStaticEffects(state: InvalidatableState): void {
  if (!state.G) return;
  state.G.staticEffectsVersion = (state.G.staticEffectsVersion ?? 0) + 1;
}
