import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/double-cross-strap.generated.ts";

export const doubleCrossStrap = defineCard(
  fabCardIdentitiesByCanonicalId["QnFfpGtbFWTWCRjMrJnc7"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      instantDestroyGainActivateOnlyIfVeHit2: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: {
          type: "compare-amount",
          amount: { type: "count", what: "combat-chain-hits" },
          comparison: { op: "gte", value: 2 },
        },
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  },
);
