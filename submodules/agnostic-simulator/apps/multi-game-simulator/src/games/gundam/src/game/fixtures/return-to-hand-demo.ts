import {
  gd01TheWitchAndTheBride117,
  st01Guncannon003,
  st01Gundam001,
  st01Guntank004,
} from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import { realResourceCards } from "./real-cards.ts";

/** A real Command effect with a varied opponent board for return-to-hand QA. */
export function loadReturnToHandDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [gd01TheWitchAndTheBride117],
      resourceArea: realResourceCards(5),
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      battleArea: [st01Guncannon003, st01Gundam001, st01Guntank004],
      deck: 30,
      resourceDeck: 10,
    },
  });
}
