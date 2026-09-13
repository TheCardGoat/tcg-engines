import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/synapse-sparkcap.generated.ts";

export const synapseSparkcap = defineCard(fabCardIdentitiesByCanonicalId["HGKWRtMqN8D6rtGHkb7RB"], {
  keywords: [battleworn],
  abilities: {
    actionBanishEvoFromHandCreatePonderToken: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "banish",
            from: "hand",
            count: 1,
            filter: {
              typeBox: {
                subtypes: ["Evo"],
              },
            },
          },
        ],
      },
      effect: {
        type: "create-token",
        token: "ponder",
        controller: "controller",
      },
    },
  },
});
