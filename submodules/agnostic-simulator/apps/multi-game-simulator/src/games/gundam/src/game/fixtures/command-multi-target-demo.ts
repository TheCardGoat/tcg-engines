import { gd01ExtremeHatred112 } from "@tcg/gundam-cards";
import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";

/**
 * Real multi-group target fixture for GD01-112 Extreme Hatred.
 *
 * The player legally plays the Command in main phase, chooses exactly two
 * active friendly Units to rest, then chooses one enemy Unit to receive
 * damage. This exercises staged board selection without injecting a pending
 * effect or mutating match state after setup.
 */
export function loadCommandMultiTargetDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [gd01ExtremeHatred112],
      resourceArea: Array.from({ length: 6 }, () => createMockResource()),
      battleArea: [
        createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, color: "red", name: "Zaku II" }),
        createMockUnit({ cost: 3, level: 3, ap: 3, hp: 5, color: "purple", name: "Dom" }),
      ],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [createMockUnit({ level: 4, ap: 3, hp: 6, name: "Enemy Gundam" })],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
