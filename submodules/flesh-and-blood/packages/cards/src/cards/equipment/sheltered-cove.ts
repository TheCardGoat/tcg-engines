import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/sheltered-cove.generated.ts";

export const shelteredCove = defineCard(fabCardIdentitiesByCanonicalId["PfLGWkcf8RngRHztHDfFT"], {
  abilities: {
    instantDestroyNextTimeWouldBeDealtDamageTurn: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  },
});
