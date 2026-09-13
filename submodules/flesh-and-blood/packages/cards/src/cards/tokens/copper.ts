import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/copper.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const copper = defineCard(fabCardIdentitiesByCanonicalId.gzDGmdfm6gHWctgrcgfKf, {
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
            amount: 4,
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
