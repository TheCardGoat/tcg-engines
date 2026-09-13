import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * Direct-player fixture — the opponent has neither a Base nor Shields, so a
 * successful direct attack reaches the opposing player under rule 8-5-2-2.
 */
export function loadDirectPlayerDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [
        createMockUnit({
          cost: 3,
          level: 3,
          ap: 3,
          hp: 4,
          color: "blue",
          name: "Gundam Base",
        }),
      ],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      shieldArea: 0,
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
