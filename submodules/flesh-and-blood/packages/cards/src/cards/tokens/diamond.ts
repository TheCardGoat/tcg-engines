import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/diamond.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const diamond = defineCard(fabCardIdentitiesByCanonicalId.HRTwtGRhPJkpHT8fN9DGp, {
  abilities: {
    destroyToDraw: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
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
