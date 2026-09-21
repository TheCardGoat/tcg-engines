import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/edge-laden-plate.generated.ts";

export const edgeLadenPlate = defineCard(fabCardIdentitiesByCanonicalId["hc9pkdhJ9qW6H7grMcjCR"], {
  keywords: [battleworn],
  abilities: {
    instantDestroyGainActivateOnlyIfVeSharpenedSword: {
      kind: "activated",
      abilityType: "instant",
      cost: { class: "effect", type: "destroy-self" },
      condition: {
        type: "performed-this-turn",
        event: "sharpen-sword",
        player: "controller",
      },
      effect: { type: "gain-resources", amount: 1 },
    },
  },
});
