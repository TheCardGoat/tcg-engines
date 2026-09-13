import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import { realResourceCards, st01Gm005, st01Guncannon003, st01Guntank004 } from "./real-cards.ts";

/**
 * Three production Units cover different printed stats and costs so QA can
 * repeat the deploy path without a one-card scene.
 */
export function loadDeployUnitDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [st01Gm005, st01Guncannon003, st01Guntank004],
      resourceArea: realResourceCards(3),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}
