import { gd02GquuuuuuxOmegaPsycommu038, st06RedGundam005, st03Zaku008 } from "@tcg/gundam-cards";
import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import {
  realResourceCards,
  st01DemiTrainer008,
  st01Gm005,
  st01Guncannon003,
  st01Guntank004,
} from "./real-cards.ts";

/** GD02-038 becomes the sixth Unit, then its Deck effect deploys ST06-005. */
export function loadDeckDeployExcessDemo(): DevRuntime {
  return createDevRuntime({
    seed: "deck-deploy-excess",
    skipToMainPhase: true,
    p1: {
      hand: [gd02GquuuuuuxOmegaPsycommu038],
      battleArea: [st01Gm005, st01DemiTrainer008, st01Guncannon003, st01Guntank004, st03Zaku008],
      resourceArea: realResourceCards(7),
      deck: [st06RedGundam005, st01Gm005, st01DemiTrainer008],
      resourceDeck: 10,
      shieldArea: 5,
    },
    p2: { deck: 30, resourceDeck: 10, shieldArea: 5 },
  });
}
