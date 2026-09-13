import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/predatory-plating.generated.ts";

/**
 * PEN003 Predatory Plating — Brute Chest d2 Guardwell.
 *
 * Printed:
 *   Instant - Destroy this: Gain {r}. Activate this only if you control a card
 *   with 6 or more {p}.
 *   Guardwell
 *
 * Model notes (hand-authored):
 * - Gate is control-object with power ≥ 6 (was supertypes "Card with 6 or more
 *   {p}" parser residue that never matched).
 * - Instant destroy-self → +1{r}.
 * - Guardwell: defend places −1{d} counters equal to printed defense (d2 → −2).
 */
export const predatoryPlating = defineCard(
  fabCardIdentitiesByCanonicalId["JRcHqqHkwdJML7wfMRhM7"],
  {
    keywords: [guardwell],
    abilities: {
      instantDestroyGainActivateOnlyIfControl6More: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: {
          type: "control-object",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
        },
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  },
);
