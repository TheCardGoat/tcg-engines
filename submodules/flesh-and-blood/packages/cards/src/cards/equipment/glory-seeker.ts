import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/glory-seeker.generated.ts";

export const glorySeeker = defineCard(fabCardIdentitiesByCanonicalId["FcfhgdgwB6BBHjbNHkFtL"], {
  abilities: {
    instantDestroyDraw: {
      kind: "activated",
      abilityType: "instant",
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
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  },
});
