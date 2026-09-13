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
        type: "control-object",
        filter: { typeBox: { subtypes: ["Sword"] }, hasStatus: "sharpened" },
      },
      effect: { type: "gain-resources", amount: 1 },
    },
  },
});
