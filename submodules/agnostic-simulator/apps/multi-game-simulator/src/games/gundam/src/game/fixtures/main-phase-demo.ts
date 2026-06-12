import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Visual playground fixture — skips straight to main phase with a populated
 * board on both sides so the simulator renders interesting state right after
 * boot. Useful for poking at UI chrome; NOT a legal mid-game state per Gundam
 * rules. Do not use this fixture for engine-correctness tests.
 */
export function loadMainPhaseDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [
        createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, color: "blue", name: "RX-78-2" }),
        createMockUnit({ cost: 2, level: 2, ap: 3, hp: 4, color: "red", name: "Zaku II" }),
        createMockUnit({ cost: 3, level: 3, ap: 4, hp: 5, color: "green", name: "Gundam GP01" }),
      ],
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "white", name: "Guncannon" }),
      ],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        createMockUnit({ cost: 3, level: 3, ap: 3, hp: 5, color: "purple", name: "Dom" }),
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
