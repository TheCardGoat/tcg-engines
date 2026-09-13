import { quell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heat-wave.generated.ts";

/**
 * FAI005 Heat Wave — Draconic Ninja Arms d0 Quell 1.
 *
 * Printed: Instant - Destroy Heat Wave: Phoenix Flames you control gain +1{p}
 * until end of turn. Quell 1
 *
 * Model notes (hand-authored):
 * - Instant destroy-self → all Phoenix Flame objects you control get +1{p} EOT.
 * - Prior zones:["permanent"] never sees Action-Attacks on the combat chain.
 *   Remodel combat-chain (controlled attacks) + moniker Phoenix Flame count star.
 * - Quell 1 keyword (arcane path not required for Instant AAA).
 */
export const heatWave = defineCard(fabCardIdentitiesByCanonicalId["Prkf9mwfBCbLDHncK6CPP"], {
  keywords: [quell(1)],
  abilities: {
    instantDestroyHeatWavePhoenixFlamesControlGain1: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            moniker: "Phoenix Flame",
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
  },
});
