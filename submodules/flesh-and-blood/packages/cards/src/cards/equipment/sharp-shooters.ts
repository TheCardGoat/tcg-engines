import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/sharp-shooters.generated.ts";

/**
 * AAZ006 Sharp Shooters — Ranger Arms d1 Battleworn.
 *
 * Printed:
 *   Action - Destroy this: Put an arrow from your hand face-up into your
 *   arsenal with an aim counter. Go again
 *   Battleworn
 *
 * Model notes (hand-authored):
 * - Arrow hand choice is declared on-stack (ability target at activation), not
 *   at-resolution. at-resolution was never collected by activation quote/
 *   declaration, so empty-hand activate still paid destroy-self — illegal.
 * - Arrow is FAB_SUBTYPES; subtypes:["Arrow"] matches normalized type-box.
 */
export const sharpShooters = defineCard(fabCardIdentitiesByCanonicalId["dbWtMTc6H6qKnbwKnLfRc"], {
  keywords: [battleworn],
  abilities: {
    actionDestroyPutArrowFromHandFaceUpInto: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              // Choose the arrow when activating (stack declaration), not only
              // when the layer resolves — gates empty-hand / non-Arrow illegality.
              declared: "on-stack",
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
            type: "add-counter",
            counter: {
              kind: "named",
              name: "aim",
            },
            count: 1,
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        ],
      },
    },
  },
});
