import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Compact setup-flow fixture — both players have enough deterministic Deck and
 * Resource Deck cards to exercise every Before the Game transition without
 * loading a complete constructed deck. Lands in the `choose-first-player`
 * phase of the setup segment, which is what the engine's own setup-flow test
 * suite (`packages/engine/src/gundam/lifecycle/setup/setup-flow.test.ts`) boots
 * from.
 *
 * Use this fixture for any test that exercises the setup → mulligan → shields →
 * main-phase transition.
 */
export function loadSetupDefault(): DevRuntime {
  return createDevRuntime({
    p1: { deck: 30, resourceDeck: 10 },
    p2: { deck: 30, resourceDeck: 10 },
  });
}
