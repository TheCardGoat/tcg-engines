import { gd01InterceptOrders099, st01Gm005, st01Guntank004, st03Gouf009 } from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import { realResourceCards } from "./real-cards.ts";

/**
 * Production-card fixture for GD01-099 Intercept Orders. The opponent board
 * deliberately offers three eligible Units with different frames and stats,
 * so QA can exercise both the one- and two-target paths.
 */
export function loadCommandRestDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [gd01InterceptOrders099],
      resourceArea: realResourceCards(4),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [st01Gm005, st01Guntank004, st03Gouf009],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
