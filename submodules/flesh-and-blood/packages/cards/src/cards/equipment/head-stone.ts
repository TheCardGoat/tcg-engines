import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/head-stone.generated.ts";

export const headStone = defineCard(fabCardIdentitiesByCanonicalId["Pm8jQMDcJhBnT8wj6rwFD"], {
  keywords: [battleworn],
  abilities: {
    instantDestroyDestroyTopDeck: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["deck"],
          position: "top",
          count: 1,
        },
        outputBinding: "it",
      },
    },
  },
});
