import {
  gd02ZetaGundam069,
  st07ArmedIntervention013,
  st10DiffuseBeamCannon015,
  st10GundamBarbatos4thForm007,
  st10GrazeDuelType009,
  st10KamilleBidan011,
  st10MarkGuilder012,
  st10MobileWorkerTekkadan010,
  st10PhoenixGundamPowerUnleashedEx006,
} from "@tcg/gundam-cards";

import { createDevRuntime, type DevRuntime } from "../dev-runtime.ts";
import {
  realResourceCards,
  st01DemiTrainer008,
  st01Guncannon003,
  st03Gouf009,
} from "./real-cards.ts";

/**
 * ST10 Pair/Link workbench with three independent hosts.
 *
 * - Mark Guilder pairs with Phoenix Gundam and applies its When Paired AP loss.
 * - Kamille Bidan links with an older Zeta-compatible Unit after two rested
 *   Units are already in play, making his rest target immediately legal.
 * - Diffuse Beam Cannon can be paired as a G Generation Pilot with Barbatos
 *   4th Form, triggering Development 2 and recovering a Command from trash.
 */
export function loadSt10PairLinkLab(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    seed: "st10-pair-link-lab",
    p1: {
      hand: [st10MarkGuilder012, st10KamilleBidan011, st10DiffuseBeamCannon015],
      battleArea: [
        st10PhoenixGundamPowerUnleashedEx006,
        st10GundamBarbatos4thForm007,
        gd02ZetaGundam069,
        { card: st01DemiTrainer008, exhausted: true },
      ],
      trash: [st10GrazeDuelType009, st10MobileWorkerTekkadan010, st07ArmedIntervention013],
      resourceArea: realResourceCards(8),
      shieldArea: 3,
      deck: 10,
      resourceDeck: 6,
    },
    p2: {
      battleArea: [{ card: st03Gouf009, exhausted: true }, st01Guncannon003],
      shieldArea: 3,
      deck: 10,
      resourceDeck: 6,
    },
  });
}
