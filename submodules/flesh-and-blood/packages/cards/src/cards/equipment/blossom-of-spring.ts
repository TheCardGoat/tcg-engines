import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blossom-of-spring.generated.ts";

export const blossomOfSpring = defineCard(fabCardIdentitiesByCanonicalId["gwz9PFtw8TdHG9DDTDctw"], {
  abilities: {
    actionDestroyGainGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
