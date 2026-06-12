import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Deploy-unit fixture — viewer sits in main-phase with one cost-1 Unit
 * in hand and three ready resources. Purpose-built for the deploy-unit
 * click-path test: keep the scene minimal so assertions are unambiguous
 * (hand 1→0, cost-1 drops resources 03/03 → 02/03), and so future
 * visual-playground tweaks to `main-phase-demo` don't affect this spec.
 */
export function loadDeployUnitDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, color: "blue", name: "RX-78-2" })],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
