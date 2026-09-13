import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/rust-belt.generated.ts";

export const rustBelt = defineCard(fabCardIdentitiesByCanonicalId["LKtdCkW87n6dJCtKqqkMw"], {
  keywords: [battleworn],
  abilities: {
    instantCogControlDestroyGain: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap",
            filter: {
              typeBox: {
                subtypes: ["Cog"],
              },
            },
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
