import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bloodtorn-bodice.generated.ts";

export const bloodtornBodice = defineCard(fabCardIdentitiesByCanonicalId["KPrJfDdHDTrz6BHRdBFMq"], {
  abilities: {
    actionDestroyAuraControlGainGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "destroy-self",
          },
          {
            class: "effect",
            type: "destroy",
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
