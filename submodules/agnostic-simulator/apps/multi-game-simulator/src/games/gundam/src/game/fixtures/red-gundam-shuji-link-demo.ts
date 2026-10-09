import { st06RedGundam006, st06ShujiIt010 } from "@tcg/gundam-cards";
import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import { realResourceCards, st01Gm005 } from "./real-cards.ts";

export function loadRedGundamShujiLinkDemo(): DevRuntime {
  return createDevRuntime({
    seed: "red-gundam-shuji-link",
    skipToMainPhase: true,
    p1: {
      hand: [st06RedGundam006, st06ShujiIt010],
      resourceArea: realResourceCards(4),
      deck: [st01Gm005, st01Gm005, st01Gm005],
      resourceDeck: 10,
      shieldArea: 5,
    },
    p2: { deck: 30, resourceDeck: 10, shieldArea: 5 },
  });
}
