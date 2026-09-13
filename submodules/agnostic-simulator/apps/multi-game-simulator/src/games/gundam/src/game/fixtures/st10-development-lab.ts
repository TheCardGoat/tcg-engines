import {
  st10GundamBarbatos1stForm008,
  st10GundamMkIiAeug003,
  st10Nemo005,
  st10SuperGundam004,
  st10TacticalTraining013,
  st10UnlockingTheDevelopmentDiagram014,
  st10ZetaGundam002,
} from "@tcg/gundam-cards";

import {
  createDevRuntime,
  DEV_PLAYER_ONE,
  DEV_PLAYER_TWO,
  type DevRuntime,
} from "../dev-runtime.ts";
import { attachAutoPassBot } from "./auto-pass.ts";
import { realResourceCards, st01Guncannon003, st01Gundam001 } from "./real-cards.ts";

/**
 * ST10 Main Phase workbench.
 *
 * The damaged Zeta makes Tactical Training immediately legal. A second Zeta
 * and Barbatos 1st Form can then consume the four staged G Generation cards
 * from trash through Development 2. Unlocking the Development Diagram can use
 * its normal payment or discard the spare Gundam Mk-II for its alternate
 * payment. Super Gundam stays damaged so the final Pass Turn exposes Repair 2.
 */
export function loadSt10DevelopmentLab(): DevRuntime {
  const dev = createDevRuntime({
    skipToMainPhase: true,
    seed: "st10-development-lab",
    clockReserveMs: 10 * 60 * 1_000,
    p1: {
      hand: [
        st10ZetaGundam002,
        st10GundamBarbatos1stForm008,
        st10TacticalTraining013,
        st10UnlockingTheDevelopmentDiagram014,
        st10GundamMkIiAeug003,
      ],
      battleArea: [
        { card: st10ZetaGundam002, damage: 2 },
        { card: st10SuperGundam004, damage: 2 },
      ],
      trash: [st10GundamMkIiAeug003, st10Nemo005, st10GundamMkIiAeug003, st10Nemo005],
      resourceArea: realResourceCards(15),
      deck: [st10GundamMkIiAeug003, st10Nemo005, st10GundamMkIiAeug003, st10Nemo005],
      shieldArea: 3,
      resourceDeck: 6,
    },
    p2: {
      battleArea: [st01Guncannon003, st01Gundam001],
      shieldArea: 3,
      deck: 10,
      resourceDeck: 6,
    },
  });

  // A single-seat lab has no opponent UI for the End Phase action window.
  // Auto-pass both seats only through step-level priority so the requested
  // player action remains one Pass Turn and the flow reaches Repair 2.
  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_ONE);
  attachAutoPassBot(dev.runtime, dev.staticResources, DEV_PLAYER_TWO);

  return dev;
}
