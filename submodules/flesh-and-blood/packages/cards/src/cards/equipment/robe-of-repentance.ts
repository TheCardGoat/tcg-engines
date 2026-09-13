import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/robe-of-repentance.generated.ts";

/**
 * IAR162 Robe of Repentance — Shadow Chest d0.
 *
 * Printed:
 *   Instant - Destroy this: Turn a card with blood debt in your banished zone
 *   face-down.
 *
 * Model notes (hand-authored):
 * - Twin of Grille of Repentance (IAR161 Head): Instant destroy-self +
 *   on-stack turn-face-down of a controller blood-debt banished card.
 * - CR 8.3.11a: face-down blood-debt does not lose life at end phase
 *   (handleBloodDebt skips face-down; proven on grille path).
 * - No keywords; defense 0 seat only.
 */
export const robeOfRepentance = defineCard(
  fabCardIdentitiesByCanonicalId["8MHFrHBN9mLtggwpbCphD"],
  {
    abilities: {
      instantDestroyTurnBloodDebtBanishedZoneFaceDown: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "turn-face-down",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "controller",
            zones: ["banished"],
            filter: {
              hasKeyword: "blood-debt",
            },
            count: 1,
          },
        },
      },
    },
  },
);
