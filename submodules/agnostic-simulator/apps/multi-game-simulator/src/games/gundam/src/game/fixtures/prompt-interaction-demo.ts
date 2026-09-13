import {
  eb01GundamDeltaKai008,
  eb01Haro017,
  gd01GundamSandrock028,
  gd01ThePathToVictoryOrDefeat109,
} from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import {
  realResourceCards,
  st01DemiTrainer008,
  st01Gm005,
  st01Guncannon003,
  st01Guntank004,
} from "./real-cards.ts";

/**
 * A production-card Development prompt with legal accept and decline paths.
 * Deploying Gundam Delta Kai may exile the staged G Generation card from
 * trash; accepting then exposes its friendly-Unit recovery target.
 */
export function loadOptionalPromptDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [eb01GundamDeltaKai008],
      battleArea: [{ card: st01Guntank004, damage: 2 }],
      trash: [eb01Haro017],
      resourceArea: realResourceCards(5),
      deck: 30,
      resourceDeck: 10,
    },
    p2: { deck: 30, resourceDeck: 10 },
  });
}

/** A production Command that opens the private top-five Deck choice resolver. */
export function loadDeckLookPromptDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      hand: [gd01ThePathToVictoryOrDefeat109],
      resourceArea: realResourceCards(5),
      deck: [
        gd01GundamSandrock028,
        st01Guntank004,
        st01Guncannon003,
        st01Gm005,
        st01DemiTrainer008,
      ],
      resourceDeck: 10,
    },
    p2: { deck: 30, resourceDeck: 10 },
  });
}
