import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mbrio-base-cortex.generated.ts";

/**
 * PEN059 mBrio Base Cortex — Mechanologist Base Chest d0 Guardwell.
 *
 * Printed:
 *   If you control a Hyper Driver, this gets +2{d}.
 *   Guardwell
 *
 * Model notes (hand-authored):
 * - control-object filter must match the permanent's printed name "Hyper Driver"
 *   (token Item or Action-turned Item). Parser residue used supertypes
 *   "Hyper driver" which never matches type-boxes.
 * - Continuous while-condition re-evaluates while equipped — duration permanent
 *   (not this-turn latch that drops at EOT while Hyper Driver remains). Same
 *   family as HVY011 raw-meat / PEN315 myrkhellir-helm / MPG012 tremor.
 */
export const mbrioBaseCortex = defineCard(fabCardIdentitiesByCanonicalId["JgFBnrrK6K8qTw8nk9jK9"], {
  keywords: [guardwell],
  abilities: {
    ifControlHyperDriverGets2: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "control-object",
        filter: {
          name: "Hyper Driver",
        },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        // Continuous while-condition: re-eval while Hyper Driver controlled.
        duration: "permanent",
      },
    },
  },
});
