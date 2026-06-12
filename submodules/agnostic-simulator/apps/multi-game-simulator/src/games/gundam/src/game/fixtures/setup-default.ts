import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Clean start-of-match fixture — both players seated with a legal deck/resource
 * deck but no other zones populated. Lands in the `choose-first-player` phase
 * of the setup segment, which is what the engine's own setup-flow test suite
 * (`packages/engine/src/gundam/lifecycle/setup/setup-flow.test.ts`) boots from.
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
