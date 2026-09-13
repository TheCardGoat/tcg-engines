import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/garland-of-spring.generated.ts";

export const garlandOfSpring = defineCard(fabCardIdentitiesByCanonicalId["cz8WjTHRfmKBGtRfPrCWr"], {
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
