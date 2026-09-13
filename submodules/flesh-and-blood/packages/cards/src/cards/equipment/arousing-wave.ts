import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/arousing-wave.generated.ts";

export const arousingWave = defineCard(fabCardIdentitiesByCanonicalId["z6hzjr7zdqfrh8nQMf6CH"], {
  keywords: [battleworn],
  abilities: {
    attackReactionDestroyCreateFangStrikeHand: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "create-token",
        token: "fang-strike",
        controller: "controller",
        to: {
          zone: "hand",
        },
      },
    },
  },
});
