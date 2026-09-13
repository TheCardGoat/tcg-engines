import { quell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silken-form.generated.ts";

/**
 * DRO007 Silken Form — Draconic Illusionist Arms d0 Quell 1.
 *
 * Printed: Instant - Destroy Silken Form: Transform target ash you control
 * into an Aether Ashwing. Quell 1
 *
 * Model notes (hand-authored):
 * - into was English residue "an-aether-ashwing" — token registry key is
 *   slug "aether-ashwing" (token:aether-ashwing), same as Ouvia / Dustup.
 * - target name "Ash" matches the printed Ash token name (DRO002).
 * - Instant destroy-self cost; no AP.
 * - Printed "target ash" is on-stack (CR 1.8.5 / 5.1.4), declared before the
 *   destroy-self cost is paid.
 */
export const silkenForm = defineCard(fabCardIdentitiesByCanonicalId["DgTbtnmDPchPRckcHTjpz"], {
  keywords: [quell(1)],
  abilities: {
    instantDestroySilkenFormTransformTargetAshControlInto: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "transform",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Ash",
          },
          count: 1,
        },
        into: "aether-ashwing",
      },
    },
  },
});
