import { createMockResource, createMockUnit } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";

/**
 * Mutual destruction fixture — AP equal to opposing HP on both sides.
 * Rule 8-5-3-2-3 (simultaneous destruction): neither side has
 * <First Strike>, so damage in the damage-step resolves simultaneously
 * and both units go to trash together.
 *
 * Viewer: Jet (AP 4, HP 4).
 * Opponent: Aggressor (AP 4, HP 4), rested so it's a legal target.
 */
export function loadMutualDestructionDemo(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    p1: {
      battleArea: [createMockUnit({ cost: 3, level: 3, ap: 4, hp: 4, color: "blue", name: "Jet" })],
      resourceArea: [createMockResource(), createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [
        {
          card: createMockUnit({
            cost: 3,
            level: 3,
            ap: 4,
            hp: 4,
            color: "red",
            name: "Aggressor",
          }),
          exhausted: true,
        },
      ],
      resourceArea: [createMockResource(), createMockResource()],
      deck: 30,
      resourceDeck: 10,
    },
  });

  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);
  return dev;
}
