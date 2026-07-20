import { gd01TheWitchAndTheBride117 } from "@tcg/gundam-cards";
import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/** A real Command effect that visibly returns an opponent Unit to its hand. */
export function loadReturnToHandDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [gd01TheWitchAndTheBride117],
      resourceArea: Array.from({ length: 5 }, () => createMockResource()),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Zaku II" }),
      ],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
