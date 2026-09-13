import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/silver.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const silver = defineCard(fabCardIdentitiesByCanonicalId.TNJz9fCgqmhhLz9rP9tkt, {
  abilities: {
    destroyToDraw: {
      kind: "activated",
      abilityType: "action",
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
      layerKeywords: [goAgain],
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  },
});
