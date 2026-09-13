import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/shock-frock.generated.ts";

export const shockFrock = defineCard(fabCardIdentitiesByCanonicalId["wwCjCpWgjmHMPNGhtQBwT"], {
  keywords: [battleworn],
  abilities: {
    actionDestroyGainActivateOnlyIfVePlayedLightning: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "played-this",
        per: "turn",
        filter: {
          typeBox: {
            supertypes: ["Lightning"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      layerKeywords: [goAgain],
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
