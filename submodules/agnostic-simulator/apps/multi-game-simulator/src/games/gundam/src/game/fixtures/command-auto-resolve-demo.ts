import { gd01AShowOfResolve100 } from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import { realResourceCards } from "./real-cards.ts";

/** A no-choice Command for proving hand -> focus -> Scrap auto-resolution. */
export function loadCommandAutoResolveDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [gd01AShowOfResolve100],
      resourceArea: realResourceCards(4),
      deck: 10,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
