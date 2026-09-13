import { createMockBase, createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * Base-combat fixture — the viewer can declare a direct attack while the
 * opponent has both a Base and Shields. Rules 8-5-2-1 and 8-5-2-4 route the
 * successful attack to the Base before any Shield can receive damage.
 *
 * The 3 AP attacker leaves 3 damage on the 5 HP Base so the resolved board
 * keeps both the damage badge and the protected Shield stack visible.
 */
export function loadBaseCombatDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [
        createMockUnit({ cost: 3, level: 3, ap: 3, hp: 4, color: "blue", name: "Gundam Base" }),
      ],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      baseSection: [createMockBase({ hp: 5, name: "Colony Base" })],
      shieldArea: 6,
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
