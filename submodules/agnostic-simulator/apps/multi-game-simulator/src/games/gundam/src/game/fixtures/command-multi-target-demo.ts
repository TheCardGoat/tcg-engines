import {
  gd01ExtremeHatred112,
  st01Gm005,
  st01Guncannon003,
  st01Gundam001,
  st01Guntank004,
  st03Gouf009,
} from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import { realResourceCards } from "./real-cards.ts";

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
      resourceArea: realResourceCards(6),
      battleArea: [st01Gm005, st01Guncannon003, st01Guntank004],
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [st01Gundam001, st03Gouf009],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
