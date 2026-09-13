import { arcaneBarrier, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bull-s-eye-bracers.generated.ts";

/**
 * ARC042 Bull's Eye Bracers — Ranger Arms d0 Arcane Barrier 1.
 *
 * Printed:
 *   Action - Destroy Bull's Eye Bracers: If you have no cards in your arsenal,
 *   you may put an arrow card from your hand face up into your arsenal. It
 *   gains +1{p} until end of turn. Go again
 *   Arcane Barrier 1
 *
 * Model notes (hand-authored):
 * - "It gains +1{p}" refers to the arrow put into arsenal, not the destroyed
 *   equipment (prior target selector:self was dead on GY equipment).
 * - +1{p} is nested inside the optional put (only when the arrow actually
 *   loads). Prior sequence applied +1 as a sibling after the conditional —
 *   even with full arsenal / declined optional.
 * - Arrow is FAB_SUBTYPES; subtypes:["Arrow"] matches normalized type-box
 *   (sharp-shooters family). types:["Arrow"] also matches via loose type-line
 *   scan, but subtypes is the canonical filter shape.
 * - Choice remains at-resolution under the optional (unlike mandatory
 *   sharp-shooters on-stack): empty arsenal with no Arrow still allows
 *   activate + decline; arsenal-occupied skips the put gate entirely.
 */
export const bullSEyeBracers = defineCard(fabCardIdentitiesByCanonicalId["FLfrm7mBczWhFLBTKmBgJ"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    actionDestroyBullSEyeBracersIfHaveNo: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "arsenal",
          player: "controller",
          comparison: {
            op: "eq",
            value: 0,
          },
        },
        then: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  filter: {
                    typeBox: {
                      subtypes: ["Arrow"],
                    },
                  },
                  count: 1,
                },
                to: {
                  zone: "arsenal",
                  visibility: "face-up",
                },
                outputBinding: "it",
              },
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 1,
                target: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            ],
          },
        },
      },
    },
  },
});
