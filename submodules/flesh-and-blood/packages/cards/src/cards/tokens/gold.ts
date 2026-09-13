import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/gold.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const gold = defineCard(fabCardIdentitiesByCanonicalId["8qdmprPg7kckn8ktMTKQh"], {
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
            amount: 2,
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
